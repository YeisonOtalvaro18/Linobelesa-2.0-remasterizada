# kill-node.ps1
Write-Host "🔫 Cerrando todos los procesos de Node.js..." -ForegroundColor Red
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Procesos de Node.js terminados" -ForegroundColor Green
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Cyan
node index.js
