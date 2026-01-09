# Script de migración de componentes UI
# Ejecutar desde la raíz del proyecto: highlight-tax-services

$sourceDir = "client/src/components/ui"
$targetDir = "next-js-refactor/src/components/ui"

# Crear directorio destino si no existe
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force
}

# Copiar todos los archivos .tsx
Get-ChildItem -Path $sourceDir -Filter "*.tsx" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $targetDir -Force
    Write-Host "Copiado: $($_.Name)"
}

Write-Host "`nMigración de componentes UI completada!"



