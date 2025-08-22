const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Cargar variables de entorno
require('dotenv').config();

const app = express();

// Configuración desde variables de entorno
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validar que existan las variables críticas
if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET no está definido en el archivo .env');
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI no está definido en el archivo .env');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB Atlas
async function conectarDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

conectarDB();

// Esquema de usuario
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 6
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

// Modelo de usuario
const Usuario = mongoose.model('registro', usuarioSchema, 'registro');

// Rutas de la API
app.post('/api/registro', async (req, res) => {
  try {
    const { nombre, apellido, correo, contraseña } = req.body;
    
    // Validar campos obligatorios
    if (!nombre || !apellido || !correo || !contraseña) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ 
        success: false, 
        message: 'El correo ya está registrado' 
      });
    }
    
    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
    
    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      correo,
      contraseña: hashedPassword
    });
    
    // Guardar usuario en la base de datos
    await nuevoUsuario.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: nuevoUsuario._id, correo: nuevoUsuario.correo },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo
      }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al registrar usuario' 
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    
    // Validar campos obligatorios
    if (!correo || !contraseña) {
      return res.status(400).json({ 
        success: false, 
        message: 'Correo y contraseña son obligatorios' 
      });
    }
    
    // Buscar usuario en la base de datos
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { userId: usuario._id, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor al iniciar sesión' 
    });
  }
});

// Ruta de verificación
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Servidor de Linobelesa funcionando correctamente',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Ruta no encontrada' 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${NODE_ENV}`);
  console.log(`🔑 JWT Secret: ${JWT_SECRET ? 'Configurado correctamente' : 'NO configurado'}`);
});

// Iniciar servidor con opción para reutilizar puerto
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${NODE_ENV}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} está ocupado. Ejecuta:`);
    console.log('   Windows: taskkill /f /im node.exe');
    console.log('   macOS/Linux: pkill -f node');
  } else {
    console.error('❌ Error al iniciar servidor:', err);
  }
});