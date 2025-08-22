@echo off
chcp 65001 > nul
echo ===============================
echo    LINOBELESA SERVER START
echo ===============================
echo.

echo 1. Cerrando procesos anteriores de Node.js...
taskkill /f /im node.exe >nul 2>&1

echo 2. Limpiando puerto 3000...
npx kill-port 3000 >nul 2>&1

echo 3. Verificando node_modules...
if not exist "node_modules" (
  echo ❌ Error: node_modules no existe
  echo Ejecuta: npm install
  pause
  exit
)

echo 4. Iniciando servidor...
echo 🚀 Servidor ejecutandose en: http://localhost:3000
echo 📋 Presiona Ctrl+C para detener
echo.

node index.js
pause