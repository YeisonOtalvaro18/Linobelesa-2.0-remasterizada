document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const showLogin = document.getElementById('showLogin');
    const showRegister = document.getElementById('showRegister');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    
    // Elementos de requisitos de contraseña
    const reqLength = document.getElementById('req-length');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');
    
    // URL de tu API backend - ¡IMPORTANTE! Cambia según tu puerto
    const API_URL = 'http://localhost:3000/api'; // Asegúrate que coincida con tu backend

    // Alternar entre formularios
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });
    
    // Funcionalidad para mostrar/ocultar contraseña
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            const loginPassword = document.getElementById('loginPassword');
            const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPassword.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
    
    // Validar contraseña en tiempo real
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePasswordConfirmation);
    
    function validatePassword() {
        const password = passwordInput.value;
        let isValid = true;
        
        // Validar longitud
        if (password.length >= 8) {
            reqLength.classList.add('valid');
            reqLength.classList.remove('invalid');
        } else {
            reqLength.classList.add('invalid');
            reqLength.classList.remove('valid');
            isValid = false;
        }
        
        // Validar número
        if (/\d/.test(password)) {
            reqNumber.classList.add('valid');
            reqNumber.classList.remove('invalid');
        } else {
            reqNumber.classList.add('invalid');
            reqNumber.classList.remove('valid');
            isValid = false;
        }
        
        // Validar carácter especial
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            reqSpecial.classList.add('valid');
            reqSpecial.classList.remove('invalid');
        } else {
            reqSpecial.classList.add('invalid');
            reqSpecial.classList.remove('valid');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validatePasswordConfirmation() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword && password !== confirmPassword) {
            passwordError.textContent = 'Las contraseñas no coinciden';
            passwordError.style.display = 'block';
            return false;
        } else {
            passwordError.style.display = 'none';
            return true;
        }
    }
    
    // Validación y envío del formulario de registro
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const isPasswordValid = validatePassword();
        const isConfirmationValid = validatePasswordConfirmation();
        
        if (!isPasswordValid) {
            passwordError.textContent = 'La contraseña no cumple con todos los requisitos';
            passwordError.style.display = 'block';
            return;
        }
        
        if (!isConfirmationValid) {
            return;
        }
        
        // Obtener datos del formulario
        const nombre = document.getElementById('username').value;
        const apellido = document.getElementById('apellido').value;
        const correo = document.getElementById('email').value;
        const contraseña = passwordInput.value;
        
        // Crear objeto con datos del usuario
        const usuario = {
            nombre,
            apellido,
            correo,
            contraseña
        };
        
        try {
            // Mostrar indicador de carga
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Registrando...';
            submitButton.disabled = true;
            
            // Enviar datos al servidor
            const response = await fetch(`${API_URL}/registro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('¡Registro exitoso! Bienvenido/a a Linobelesa.');
                registerForm.reset();
                
                // Resetear indicadores de requisitos
                reqLength.classList.remove('valid', 'invalid');
                reqNumber.classList.remove('valid', 'invalid');
                reqSpecial.classList.remove('valid', 'invalid');
                
                // Cambiar al formulario de inicio de sesión
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión. Intenta nuevamente.');
        } finally {
            // Restaurar botón
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }
    });
    
    // Validación y envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const correo = document.getElementById('loginEmail').value;
        const contraseña = document.getElementById('loginPassword').value;
        
        try {
            // Mostrar indicador de carga
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Iniciando sesión...';
            submitButton.disabled = true;
            
            // Enviar credenciales al servidor
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, contraseña })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('¡Inicio de sesión exitoso! Bienvenido/a de nuevo a Linobelesa.');
                
                // Guardar token de autenticación si existe
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userData', JSON.stringify(data.usuario));
                }
                
                // Redirigir al usuario a la página principal
                window.location.href = '/bienvenida.html'; // Cambia por tu URL de destino
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión. Intenta nuevamente.');
        } finally {
            // Restaurar botón
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }
    });
});