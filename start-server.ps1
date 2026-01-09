# Script para iniciar el servidor Next.js
Write-Host "🛑 Deteniendo procesos Node.js existentes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "🚀 Iniciando servidor Next.js..." -ForegroundColor Green
Write-Host ""
Write-Host "📋 El servidor estará disponible en:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏳ Iniciando (puede tardar 10-20 segundos)..." -ForegroundColor White
Write-Host ""

Set-Location $PSScriptRoot
npm run dev


