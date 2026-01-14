# Script para iniciar el backend con IP automática (modo silencioso)

# Suprimir salida de consola
$ErrorActionPreference = 'SilentlyContinue'

# 1. Detectar la IP de la máquina (prioridad: Ethernet, luego WiFi)

# Intentar obtener IP de Ethernet primero
$localIP = Get-NetIPConfiguration | 
    Where-Object { 
        $_.IPv4DefaultGateway -ne $null -and 
        $_.NetAdapter.Status -eq "Up" -and
        $_.InterfaceAlias -like "*Ethernet*" -and
        $_.NetAdapter.InterfaceDescription -notlike "*Hamachi*" -and
        $_.NetAdapter.InterfaceDescription -notlike "*VPN*"
    } | 
    Select-Object -First 1 | 
    ForEach-Object { $_.IPv4Address.IPAddress }

# Si no hay Ethernet, buscar WiFi
if (-not $localIP) {
    $localIP = Get-NetIPConfiguration | 
        Where-Object { 
            $_.IPv4DefaultGateway -ne $null -and 
            $_.NetAdapter.Status -eq "Up" -and
            $_.InterfaceAlias -like "*Wi-Fi*" -and
            $_.NetAdapter.InterfaceDescription -notlike "*Hamachi*" -and
            $_.NetAdapter.InterfaceDescription -notlike "*VPN*"
        } | 
        Select-Object -First 1 | 
        ForEach-Object { $_.IPv4Address.IPAddress }
}

# Filtrar para asegurar que es una IP de red local (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
if (-not ($localIP -and $localIP -match '^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)')) {
    exit 1
}

# 2. Actualizar el archivo config.js del frontend
$configPath = ".\frontend\src\config.js"

# Crear el contenido línea por línea para asegurar expansión de variables
$line1 = "// Define la URL base de tu backend principal (Python/Flask)"
$line2 = "// Usa la variable de entorno si existe, si no, usa la IP local."
$line3 = "const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://${localIP}:5000';"
$line4 = ""
$line5 = "// Define la URL base de tu backend de embeddings (Python/embeddings)"
$line6 = "// Cambia la IP si este servicio corre en otra máquina."
$line7 = "const EMBEDDING_API_URL = process.env.REACT_APP_EMBEDDING_API_URL || 'http://${localIP}:8001';"
$line8 = ""
$line9 = "export { API_BASE_URL, EMBEDDING_API_URL };"
$line10 = ""
$line11 = "// Para producción, podrías cambiar 'http://192.168.0.107:5000' por la IP de tu servidor."

$configContent = @($line1, $line2, $line3, $line4, $line5, $line6, $line7, $line8, $line9, $line10, $line11) -join "`n"

# Escribir el archivo
Set-Content -Path $configPath -Value $configContent -Encoding UTF8 -Force

# 3. Iniciar el backend (modo silencioso)
Set-Location backend
node app.js *> $null
