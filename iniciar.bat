@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
color 0B
title Sistema de Gestión de Arrestos

:MENU
cls

REM Verificar si el sistema ya está corriendo
set "SISTEMA_CORRIENDO=NO"
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if %ERRORLEVEL% EQU 0 (
    netstat -ano | find ":3001" | find "LISTENING" >nul 2>&1
    if %ERRORLEVEL% EQU 0 set "SISTEMA_CORRIENDO=SI"
)

echo.
echo     ╔═══════════════════════════════════════════════╗
echo     ║                                               ║
echo     ║      SISTEMA DE GESTIÓN DE ARRESTOS          ║
echo     ║                                               ║
echo     ╚═══════════════════════════════════════════════╝
echo.

REM Mostrar estado del sistema
if "%SISTEMA_CORRIENDO%"=="SI" (
    echo          ╔═══════════════════════════════════════════╗
    echo          ║  ✓ SISTEMA ACTUALMENTE EN EJECUCIÓN      ║
    echo          ╚═══════════════════════════════════════════╝
    echo.
)

echo.
echo          ┌─────────────────────────────────┐
echo          │                                 │
echo          │   [1]  Iniciar Sistema          │
echo          │                                 │
echo          │   [2]  Detener Sistema          │
echo          │                                 │
echo          │   [3]  Salir                    │
echo          │                                 │
echo          └─────────────────────────────────┘
echo.
echo.
set /p opcion="          Ingrese su opción (1-3): "

if "%opcion%"=="1" goto INICIAR
if "%opcion%"=="2" goto APAGAR
if "%opcion%"=="3" goto SALIR
echo.
echo          ⚠️  Opción no válida. Intente nuevamente.
timeout /t 2 >nul
goto MENU

:INICIAR
cls

REM Verificar si ya está corriendo
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if %ERRORLEVEL% EQU 0 (
    netstat -ano | find ":3001" | find "LISTENING" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo     ╔═══════════════════════════════════════════════╗
        echo     ║                                               ║
        echo     ║          ℹ  SISTEMA YA ESTÁ CORRIENDO        ║
        echo     ║                                               ║
        echo     ╚═══════════════════════════════════════════════╝
        echo.
        echo.
        echo          El sistema ya se encuentra en ejecución.
        echo.
        echo          Si desea reiniciarlo, primero deténgalo
        echo          con la opción [2] del menú.
        echo.
        echo.
        echo          Presione cualquier tecla para volver al menú...
        pause >nul
        goto MENU
    )
)

echo.
echo     ╔═══════════════════════════════════════════════╗
echo     ║                                               ║
echo     ║            INICIANDO SISTEMA...               ║
echo     ║                                               ║
echo     ╚═══════════════════════════════════════════════╝
echo.
echo.
echo          Por favor espere...
echo.

REM Verificar si Docker Desktop está corriendo
echo          ▪ Verificando Docker Desktop...
docker ps >nul 2>&1
if errorlevel 1 (
    echo          ℹ  Docker Desktop no está corriendo
    echo          ▪ Iniciando Docker Desktop...
    
    REM Intentar abrir Docker Desktop
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" >nul 2>&1
    
    REM Esperar a que Docker Desktop esté listo (máximo 60 segundos)
    set /a CONTADOR=0
    :WAIT_DOCKER
    timeout /t 2 >nul
    docker ps >nul 2>&1
    if errorlevel 1 (
        set /a CONTADOR+=1
        if !CONTADOR! LSS 30 (
            echo          ▪ Esperando a Docker Desktop... (!CONTADOR!/30^)
            goto WAIT_DOCKER
        ) else (
            echo          ⚠️  Docker Desktop no respondió a tiempo
            echo          ⚠️  Por favor inicie Docker Desktop manualmente
            echo.
            echo          Presione cualquier tecla para continuar...
            pause >nul
            goto MENU
        )
    )
    echo          ✓ Docker Desktop listo
    timeout /t 1 >nul
) else (
    echo          ✓ Docker Desktop corriendo
    timeout /t 1 >nul
)

echo.
echo          ▪ Preparando base de datos...
docker-compose up -d >nul 2>&1
if errorlevel 1 (
    echo          ⚠️  Advertencia: Base de datos no disponible
    timeout /t 2 >nul
) else (
    echo          ✓ Base de datos lista
    timeout /t 1 >nul
)

echo.
echo          ▪ Configurando servidor...
call :START_BACKEND
timeout /t 3 >nul
echo          ✓ Servidor configurado

echo.
echo          ▪ Abriendo aplicación...
call :START_FRONTEND
timeout /t 2 >nul
echo          ✓ Aplicación lista

echo.
echo.
echo     ╔═══════════════════════════════════════════════╗
echo     ║                                               ║
echo     ║       ✓  SISTEMA INICIADO EXITOSAMENTE       ║
echo     ║                                               ║
echo     ╚═══════════════════════════════════════════════╝
echo.
echo.
echo          El navegador se abrirá automáticamente
echo          en unos segundos...
echo.
echo          ╔════════════════════════════════════════════╗
echo          ║                                            ║
echo          ║  Puede minimizar o cerrar esta ventana.   ║
echo          ║  El sistema seguirá funcionando.          ║
echo          ║                                            ║
echo          ║  Para detener o verificar el estado,      ║
echo          ║  ejecute este programa nuevamente.        ║
echo          ║                                            ║
echo          ╚════════════════════════════════════════════╝
echo.
echo.
echo          Presione cualquier tecla para volver al menú...
pause >nul
goto MENU

:APAGAR
cls
echo.
echo     ╔═══════════════════════════════════════════════╗
echo     ║                                               ║
echo     ║            DETENIENDO SISTEMA...              ║
echo     ║                                               ║
echo     ╚═══════════════════════════════════════════════╝
echo.
echo.
echo          Por favor espere...
echo.
echo          ▪ Cerrando aplicación...
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
    echo          ℹ  Sistema ya estaba detenido
) else (
    echo          ✓ Aplicación cerrada
)
timeout /t 1 >nul

echo.
echo          ▪ Deteniendo servicios...
docker-compose down >nul 2>&1
if errorlevel 1 (
    echo          ℹ  Servicios ya estaban detenidos
) else (
    echo          ✓ Servicios detenidos
)
timeout /t 1 >nul

echo.
echo          ▪ Liberando recursos...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
echo          ✓ Recursos liberados

echo.
echo.
echo     ╔═══════════════════════════════════════════════╗
echo     ║                                               ║
echo     ║        ✓  SISTEMA DETENIDO EXITOSAMENTE      ║
echo     ║                                               ║
echo     ╚═══════════════════════════════════════════════╝
echo.
echo.
echo          El sistema ha sido cerrado correctamente.
echo          Puede cerrar esta ventana de forma segura.
echo.
echo.
echo          Presione cualquier tecla para volver al menú...
pause >nul
goto MENU

:SALIR
cls
echo.
echo.
echo.
echo          ╔═══════════════════════════════════════╗
echo          ║                                       ║
echo          ║      Gracias por usar el sistema     ║
echo          ║                                       ║
echo          ╚═══════════════════════════════════════╝
echo.
echo.
timeout /t 2 >nul
exit

REM ===== FUNCIONES =====

:START_BACKEND
start "" /MIN %SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -File \"%~dp0start-backend.ps1\"' -WindowStyle Hidden"
exit /b

:START_FRONTEND
%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -Command "Start-Process cmd -ArgumentList '/c cd /d \"%~dp0frontend\" && npm start' -WindowStyle Hidden"
exit /b
