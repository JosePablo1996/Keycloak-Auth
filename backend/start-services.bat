@echo off
setlocal EnableDelayedExpansion

:: Verificar y solicitar permisos de administrador
:check_admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  EJECUCIÓN COMO ADMINISTRADOR REQUERIDA
    echo ─────────────────────────────────────────────────────────────────────
    echo Este script requiere permisos de administrador para:
    echo • Gestionar procesos del sistema
    echo • Acceder a puertos de red
    echo • Ejecutar comandos de sistema
    echo.
    echo Presiona cualquier tecla para intentar ejecutar como administrador...
    pause >nul
    goto :elevate
)

:: Configuración inicial
chcp 65001 >nul
title 🔐 KEYCLOAK AUTH MANAGER v4.0.0 - UFG

set "PROJECT_ROOT=C:\proyectos_react_native\KeycloakSSOApp"
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "SCRIPT_DIR=%~dp0"
set "NODE_PID=0"
set "IS_ADMIN=1"

goto :main_menu

:: Elevar permisos a administrador
:elevate
echo 🔄 Solicitando permisos de administrador...
set "batchPath=%~0"
set "batchArgs=%*"
set "vbsGetAdmin=%temp%\getadmin.vbs"

:: Crear script VBS para elevación
echo Set UAC = CreateObject^("Shell.Application"^) > "%vbsGetAdmin%"
echo UAC.ShellExecute "cmd.exe", "/c ""!batchPath! !batchArgs!""", "", "runas", 1 >> "%vbsGetAdmin%"

"%vbsGetAdmin%" >nul
del "%vbsGetAdmin%" >nul 2>&1
exit /b

:main_menu
call :show_header

echo                     🎯 MENÚ PRINCIPAL - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo     📦 GESTIÓN DE SERVICIOS
call :separator
echo     1. 🚀  Inicio Rápido (Recomendado)
echo     2. 🔥  Iniciar Backend (Servidor API)
echo     3. 🛑  Detener Todos los Servicios
echo.

echo     📊 MONITOREO Y ESTADO
call :separator
echo     4. 📈  Panel de Estado de Servicios
echo     5. 🔄  Monitor en Tiempo Real
echo.

echo     🛠️  HERRAMIENTAS DEL SISTEMA
call :separator
echo     6. ⚙️  Utilidades del Sistema
echo     7. 📋 Configuración Rápida
echo.

echo     ℹ️  INFORMACIÓN Y AYUDA
call :separator
echo     8. 📖  Centro de Ayuda
echo     9. 💡  Información del Sistema
echo     0. 👨‍💻 Acerca del Proyecto
echo.

call :double_separator

echo     🌐 SERVICIOS DEL SISTEMA
call :separator
echo        📍 Backend API:  http://localhost:3001/api/health
echo        🔑 Keycloak:     http://localhost:8080
echo        ⚛️  Frontend:     http://localhost:19006
echo.

echo     📊 ESTADO ACTUAL:
call :check_quick_status
echo.

echo     🔐 PERMISOS: !IS_ADMIN!
call :separator
echo     Desarrollado con ❤️ por José Pablo Miranda Quintanilla
echo     🏫 Universidad Francisco Gavidia • v4.0.0
echo.

choice /C 1234567890 /N /M "🎯 Selecciona una opción [0-9]: "

if %errorlevel% equ 1 goto quick_start
if %errorlevel% equ 2 goto start_backend
if %errorlevel% equ 3 goto stop_services
if %errorlevel% equ 4 goto check_status
if %errorlevel% equ 5 goto realtime_monitor
if %errorlevel% equ 6 goto utilities
if %errorlevel% equ 7 goto quick_config
if %errorlevel% equ 8 goto help_center
if %errorlevel% equ 9 goto system_info
if %errorlevel% equ 10 goto about

:: Funciones de utilidad
:show_header
cls
echo.
echo              ╔═══════════════════════════════════════════════════════════════╗
echo              ║                                                               ║
echo              ║                  🔐 KEYCLOAK AUTH MANAGER                     ║
echo              ║                         Version 4.0.0                          ║
echo              ║                 Universidad Francisco Gavidia                 ║
echo              ║                                                               ║
echo              ╚═══════════════════════════════════════════════════════════════╝
echo.
goto :eof

:separator
echo ─────────────────────────────────────────────────────────────────────
goto :eof

:double_separator
echo ═════════════════════════════════════════════════════════════════════
goto :eof

:section_separator
echo ──────────────────── %~1 ────────────────────
goto :eof

:styled_pause
echo.
echo.
set /p=🎯 Presiona ENTER para continuar... <nul
pause >nul
goto :eof

:show_success
echo ✅ %~1
goto :eof

:show_error
echo ❌ %~1
goto :eof

:show_warning
echo ⚠️  %~1
goto :eof

:show_info
echo ℹ️  %~1
goto :eof

:show_step
echo 📌 %~1
goto :eof

:show_service
echo 🔹 %~1
goto :eof

:loading_animation
setlocal
set "chars=⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
set "counter=0"
:loading_loop
set /a "counter+=1"
set /a "char_index=counter %% 10"
call set "char=%%chars:~!char_index!,1%%"
set /p="!char! %~1" <nul
ping -n 1 127.0.0.1 >nul 2>&1
set /p= <nul
if !counter! lss 15 goto loading_loop
echo.
endlocal
goto :eof

:check_quick_status
setlocal
echo    🔍 Verificando servicios...
tasklist /fi "imagename eq node.exe" | find /i "node" >nul
if errorlevel 1 (echo    🔴 Backend: Inactivo) else (echo    🟢 Backend: Activo)

netstat -an | find ":8080" | find "LISTENING" >nul
if errorlevel 1 (echo    🔴 Keycloak: Inactivo) else (echo    🟢 Keycloak: Activo)

netstat -an | find ":19006" | find "LISTENING" >nul
if errorlevel 1 (echo    🔴 Frontend: Inactivo) else (echo    🟢 Frontend: Activo)
endlocal
goto :eof

:quick_start
call :show_header
echo                     🚀 INICIO RÁPIDO - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

call :show_step "Bienvenido al asistente de inicio rápido"
echo Este asistente te guiará en el proceso de inicio de todos los servicios
echo necesarios para el KEYCLOAK AUTH MANAGER de la UFG.
echo.

call :loading_animation "Iniciando verificación del sistema"

echo.
echo 📋 PASOS A SEGUIR:
call :section_separator "FLUJO DE CONFIGURACIÓN"
call :show_step "1. Verificar permisos de administrador"
call :show_step "2. Comprobar dependencias del sistema"
call :show_step "3. Iniciar servidor backend"
call :show_step "4. Verificar estado de servicios"
call :show_step "5. Monitorear en tiempo real"
echo.

call :styled_pause

:: Verificar permisos
call :show_header
echo                     🚀 INICIO RÁPIDO - PASO 1/5
call :double_separator
echo.

call :show_step "Verificando permisos de administrador..."
net session >nul 2>&1
if errorlevel 1 (
    call :show_error "Permisos de administrador insuficientes"
    echo.
    echo Se requieren permisos de administrador para continuar.
    call :styled_pause
    goto main_menu
)
call :show_success "Permisos de administrador confirmados"

:: Verificar dependencias
call :show_step "Verificando dependencias del sistema..."
node --version >nul 2>&1
if errorlevel 1 (
    call :show_error "Node.js no encontrado"
    echo.
    echo Instala Node.js desde: https://nodejs.org/
    call :styled_pause
    goto main_menu
)
for /f "tokens=*" %%i in ('node --version 2^>nul') do set "NODE_VERSION=%%i"
call :show_success "Node.js !NODE_VERSION! detectado"

:: Verificar directorio
call :show_step "Verificando estructura del proyecto..."
if not exist "%BACKEND_DIR%" (
    call :show_error "Directorio del proyecto no encontrado"
    echo Directorio esperado: %BACKEND_DIR%
    call :styled_pause
    goto main_menu
)
call :show_success "Estructura del proyecto verificada"

echo.
call :show_success "Verificación del sistema completada"
call :styled_pause

:: Continuar con inicio del backend
goto start_backend

:start_backend
call :show_header
echo                     🔥 INICIAR BACKEND - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

:: Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    call :show_error "Permisos de administrador insuficientes"
    echo El backend requiere permisos elevados para ejecutarse correctamente.
    call :styled_pause
    goto main_menu
)

:: Verificar si el directorio existe
if not exist "%BACKEND_DIR%" (
    call :show_error "No se encuentra el directorio del backend"
    echo Directorio esperado: %BACKEND_DIR%
    echo.
    echo Posibles soluciones:
    echo 📌 Verificar la ruta del proyecto
    echo 📌 Actualizar PROJECT_ROOT en el script
    echo 📌 Crear la estructura de directorios
    call :styled_pause
    goto main_menu
)

:: Cambiar al directorio del backend
cd /d "%BACKEND_DIR%" 2>nul
if errorlevel 1 (
    call :show_error "No se puede acceder al directorio del backend"
    echo Verifica los permisos de la carpeta: %BACKEND_DIR%
    call :styled_pause
    goto main_menu
)

:: Verificar Node.js
call :loading_animation "Verificando entorno Node.js"
node --version >nul 2>&1
if errorlevel 1 (
    call :show_error "Node.js no está instalado o no está en el PATH"
    echo.
    echo Soluciones:
    echo 📌 Instalar Node.js desde https://nodejs.org/
    echo 📌 Agregar Node.js al PATH del sistema
    echo 📌 Reiniciar el sistema después de la instalación
    call :styled_pause
    goto main_menu
)
for /f "tokens=*" %%i in ('node --version 2^>nul') do set "NODE_VERSION=%%i"
call :show_success "Node.js !NODE_VERSION! detectado"

:: Verificar package.json
if not exist "package.json" (
    call :show_error "No se encuentra package.json en el directorio"
    echo Asegúrate de que este es el directorio correcto del proyecto.
    call :styled_pause
    goto main_menu
)

:: Verificar/crear .env
if not exist ".env" (
    call :show_warning "Creando archivo .env con configuración básica"
    (
        echo # Configuración KEYCLOAK AUTH MANAGER - UFG
        echo KEYCLOAK_URL=http://localhost:8080
        echo KEYCLOAK_REALM=ufg-realm
        echo KEYCLOAK_ADMIN_USERNAME=admin
        echo KEYCLOAK_ADMIN_PASSWORD=admin123
        echo KEYCLOAK_CLIENT_ID=ufg-client
        echo BACKEND_PORT=3001
        echo NODE_ENV=development
        echo DATABASE_URL=postgresql://localhost:5432/ufg_sso
        echo JWT_SECRET=ufg-sso-secret-key-2024
    ) > .env
    call :show_success "Archivo .env creado exitosamente"
    echo.
)

:: Instalar dependencias si no existen
if not exist "node_modules" (
    call :loading_animation "Instalando dependencias del proyecto"
    call npm install --no-optional --silent
    if errorlevel 1 (
        call :show_error "Falló la instalación de dependencias"
        echo.
        echo Intenta ejecutar manualmente: npm install
        call :styled_pause
        goto main_menu
    )
    call :show_success "Dependencias instaladas correctamente"
    echo.
)

echo 🚀 INICIANDO SERVIDOR BACKEND KEYCLOAK AUTH MANAGER
call :double_separator
echo 📍 Directorio: %BACKEND_DIR%
echo 📍 Puerto: 3001
echo 🔗 URL: http://localhost:3001/api/health
echo ⏰ Hora de inicio: %date% %time%
echo 🔐 Permisos: Administrador
echo 🏫 Institución: Universidad Francisco Gavidia
echo.
call :show_info "Presiona Ctrl+C para detener el servidor"
call :double_separator
echo.

:: Iniciar el servidor con reinicio automático
:restart_server
echo 🔄 [!date! !time!] Iniciando servidor backend KEYCLOAK AUTH MANAGER...
echo.

:: Verificar si el puerto está disponible
netstat -an | find ":3001" | find "LISTENING" >nul
if not errorlevel 1 (
    call :show_warning "El puerto 3001 está en uso"
    echo Cerrando procesos conflictivos...
    for /f "tokens=5" %%a in ('netstat -ano ^| find ":3001" ^| find "LISTENING"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

call npm run dev
set NODE_EXIT_CODE=%errorlevel%

echo.
call :double_separator
echo ⚠️  El servidor se ha detenido con código de salida: !NODE_EXIT_CODE!

if !NODE_EXIT_CODE! equ 0 (
    call :show_success "Servidor detenido normalmente"
    call :styled_pause
    goto main_menu
) else if !NODE_EXIT_CODE! equ 1 (
    call :show_warning "Error en la aplicación - Reiniciando..."
) else if !NODE_EXIT_CODE! equ 3221225786 (
    call :show_error "Error de acceso - Verifica permisos de administrador"
    call :styled_pause
    goto main_menu
) else (
    call :show_warning "Error inesperado - Reiniciando en 5 segundos..."
)

echo.
call :show_info "Reiniciando servidor KEYCLOAK AUTH MANAGER..."
timeout /t 5 /nobreak >nul
goto restart_server

goto main_menu

:check_status
call :show_header
echo                     📊 PANEL DE ESTADO - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

call :loading_animation "Analizando estado del sistema KEYCLOAK AUTH MANAGER"

echo.
echo 📋 ESTADO DETALLADO DE SERVICIOS:
call :section_separator "SERVICIOS PRINCIPALES"

:: Verificar Backend
echo 🔵 BACKEND SSO (Puerto 3001):
tasklist /fi "imagename eq node.exe" | find /i "node" >nul
if errorlevel 1 (
    call :show_error "Servicio DETENIDO"
) else (
    call :show_success "Servicio EN EJECUCIÓN"
    powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -TimeoutSec 3 -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
    if errorlevel 1 (
        call :show_warning "API no responde (posible inicio en progreso)"
    ) else (
        call :show_success "API respondiendo correctamente"
    )
)

:: Verificar Keycloak
echo.
echo 🟠 KEYCLOAK (Puerto 8080):
netstat -an | find ":8080" | find "LISTENING" >nul
if errorlevel 1 (
    call :show_error "Servicio DETENIDO"
) else (
    call :show_success "Servicio EN EJECUCIÓN"
    powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8080' -TimeoutSec 3 -UseBasicParsing | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
    if errorlevel 1 (
        call :show_warning "Keycloak no responde completamente"
    ) else (
        call :show_success "Keycloak respondiendo"
    )
)

:: Verificar Frontend
echo.
echo 🟣 FRONTEND (Puerto 19006):
netstat -an | find ":19006" | find "LISTENING" >nul
if errorlevel 1 (
    call :show_error "Servicio DETENIDO"
) else (
    call :show_success "Servicio EN EJECUCIÓN"
)

:: Verificar permisos
echo.
call :section_separator "CONFIGURACIÓN DEL SISTEMA"
echo 🔐 PERMISOS DEL SISTEMA:
net session >nul 2>&1
if errorlevel 1 (
    call :show_error "Ejecutando sin permisos de administrador"
) else (
    call :show_success "Ejecutando como administrador"
)

echo.
call :double_separator
call :styled_pause
goto main_menu

:realtime_monitor
call :show_header
echo                     🔄 MONITOR EN TIEMPO REAL - KEYCLOAK AUTH MANAGER
call :double_separator
echo ⏰ Actualizado: !time!
echo 🛑 Presiona Ctrl+C para salir del monitor
echo.

:monitor_loop
echo 📊 ESTADO ACTUAL DEL SISTEMA - !time!
call :separator

:: Backend status
echo 🔵 BACKEND SSO: 
tasklist /fi "imagename eq node.exe" | find /i "node" >nul
if errorlevel 1 (call :show_error "❌ INACTIVO") else (call :show_success "✅ ACTIVO")

:: Keycloak status
echo 🟠 KEYCLOAK: 
netstat -an | find ":8080" | find "LISTENING" >nul
if errorlevel 1 (call :show_error "❌ INACTIVO") else (call :show_success "✅ ACTIVO")

:: Frontend status
echo 🟣 FRONTEND: 
netstat -an | find ":19006" | find "LISTENING" >nul
if errorlevel 1 (call :show_error "❌ INACTIVO") else (call :show_success "✅ ACTIVO")

:: Permisos status
echo 🔐 PERMISOS: 
net session >nul 2>&1
if errorlevel 1 (call :show_error "👤 USUARIO") else (call :show_success "🛡️ ADMIN")

echo.
call :show_info "Actualizando en 3 segundos..."
timeout /t 3 /nobreak >nul
cls
call :show_header
echo                     🔄 MONITOR EN TIEMPO REAL - KEYCLOAK AUTH MANAGER
call :double_separator
echo ⏰ Actualizado: !time!
echo 🛑 Presiona Ctrl+C para salir del monitor
echo.
goto monitor_loop

:utilities
call :show_header
echo                     🛠️  UTILIDADES DEL SISTEMA - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo     🔧 HERRAMIENTAS DE DIAGNÓSTICO
call :separator
echo     1. 📋 Verificar Dependencias del Sistema
echo     2. 🔍 Verificar Puertos en Uso
echo     3. 🖥️  Ver Procesos Activos
echo.

echo     📁 GESTIÓN DE ARCHIVOS
call :separator
echo     4. 📂 Abrir Directorio del Proyecto
echo     5. 🧹 Limpiar Cache de Node.js
echo.

echo     ⚙️  CONFIGURACIÓN
call :separator
echo     6. ⚡ Configuración Rápida
echo     7. 🔙 Volver al Menú Principal
echo.

choice /C 1234567 /N /M "🎯 Selecciona una utilidad [1-7]: "

if %errorlevel% equ 1 goto check_dependencies
if %errorlevel% equ 2 goto check_ports
if %errorlevel% equ 3 goto check_processes
if %errorlevel% equ 4 goto open_project_dir
if %errorlevel% equ 5 goto clear_cache
if %errorlevel% equ 6 goto quick_config
if %errorlevel% equ 7 goto main_menu

:quick_config
call :show_header
echo                     ⚙️  CONFIGURACIÓN RÁPIDA - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

call :show_step "Configuración rápida del sistema KEYCLOAK AUTH MANAGER"
echo.
echo Esta utilidad te ayudará a configurar rápidamente el entorno
echo de desarrollo para el KEYCLOAK AUTH MANAGER de la UFG.
echo.

call :loading_animation "Preparando configuración rápida"

echo.
echo 📋 CONFIGURACIÓN DISPONIBLE:
call :section_separator "OPCIONES DE CONFIGURACIÓN"
echo 1. 🔑 Configurar variables de Keycloak
echo 2. 🗄️  Configurar base de datos
echo 3. 🌐 Configurar URLs y puertos
echo 4. 🔐 Configurar seguridad JWT
echo 5. 🔙 Volver a utilidades
echo.

choice /C 12345 /N /M "🎯 Selecciona configuración [1-5]: "

if %errorlevel% equ 1 goto config_keycloak
if %errorlevel% equ 2 goto config_database
if %errorlevel% equ 3 goto config_urls
if %errorlevel% equ 4 goto config_jwt
if %errorlevel% equ 5 goto utilities

:config_keycloak
call :show_header
echo                     🔑 CONFIGURAR KEYCLOAK
call :double_separator
echo.

call :show_step "Configurando variables de Keycloak..."
if exist "%BACKEND_DIR%\.env" (
    echo Configuración actual de Keycloak:
    call :separator
    findstr "KEYCLOAK" "%BACKEND_DIR%\.env"
    echo.
    call :show_info "Edita el archivo .env manualmente para cambios avanzados"
) else (
    call :show_warning "Archivo .env no encontrado"
    call :show_info "Se creará automáticamente al iniciar el backend"
)

call :styled_pause
goto quick_config

:config_database
call :show_header
echo                     🗄️  CONFIGURAR BASE DE DATOS
call :double_separator
echo.

call :show_step "Configuración de base de datos PostgreSQL..."
echo.
echo Configuración recomendada:
call :separator
echo 📍 Host: localhost
echo 📍 Puerto: 5432
echo 📍 Base de datos: ufg_sso
echo 📍 Usuario: postgres
echo 📍 Password: [tu_password]
echo.
call :show_info "Configura estos valores en el archivo .env"
call :styled_pause
goto quick_config

:config_urls
call :show_header
echo                     🌐 CONFIGURAR URLs Y PUERTOS
call :double_separator
echo.

call :show_step "Configuración de URLs y puertos..."
echo.
echo URLs y puertos actuales:
call :separator
echo 🔵 Backend: http://localhost:3001
echo 🟠 Keycloak: http://localhost:8080
echo 🟣 Frontend: http://localhost:19006
echo.
call :show_info "Para cambiar puertos, modifica BACKEND_PORT en .env"
call :styled_pause
goto quick_config

:config_jwt
call :show_header
echo                     🔐 CONFIGURAR SEGURIDAD JWT
call :double_separator
echo.

call :show_step "Configuración de seguridad JWT..."
echo.
echo Configuración de seguridad:
call :separator
echo 🔑 JWT Secret: ufg-sso-secret-key-2024
echo ⏰ Token Expiración: 1h (configurable)
echo 🔒 Algoritmo: HS256
echo.
call :show_warning "Cambia el JWT_SECRET en producción!"
call :styled_pause
goto quick_config

:check_dependencies
call :show_header
echo                     🔧 VERIFICAR DEPENDENCIAS - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

call :loading_animation "Analizando dependencias del sistema"

echo.
echo 📋 ESTADO DE DEPENDENCIAS:
call :section_separator "DEPENDENCIAS PRINCIPALES"

:: Node.js
echo 🟢 Node.js:
node --version >nul 2>&1
if errorlevel 1 (call :show_error "No instalado") else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do call :show_success "Versión %%i"
)

:: NPM
echo.
echo 📦 NPM:
npm --version >nul 2>&1
if errorlevel 1 (call :show_error "No disponible") else (
    for /f "tokens=*" %%i in ('npm --version 2^>nul') do call :show_success "Versión %%i"
)

:: Directorio del proyecto
echo.
echo 📁 Directorio del Proyecto:
if exist "%BACKEND_DIR%" (
    call :show_success "Encontrado: %BACKEND_DIR%"
) else (
    call :show_error "No encontrado: %BACKEND_DIR%"
)

:: package.json
echo.
echo 📄 package.json:
if exist "%BACKEND_DIR%\package.json" (
    call :show_success "Archivo presente"
) else (
    call :show_error "Archivo no encontrado"
)

:: Permisos
echo.
call :section_separator "CONFIGURACIÓN DEL SISTEMA"
echo 🔐 Permisos de Administrador:
net session >nul 2>&1
if errorlevel 1 (
    call :show_error "Ejecuta como administrador"
) else (
    call :show_success "Permisos adecuados"
)

call :styled_pause
goto utilities

:open_project_dir
call :show_header
echo                     📁 ABRIR DIRECTORIO - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

if exist "%BACKEND_DIR%" (
    call :loading_animation "Abriendo directorio del proyecto"
    explorer "%BACKEND_DIR%"
    call :show_success "Directorio abierto: %BACKEND_DIR%"
) else (
    call :show_error "No se puede abrir el directorio: %BACKEND_DIR%"
    echo Verifica que la ruta exista y tengas permisos de acceso.
)

call :styled_pause
goto utilities

:clear_cache
call :show_header
echo                     🧹 LIMPIAR CACHE - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

call :loading_animation "Preparando limpieza de cache"

cd /d "%BACKEND_DIR%" 2>nul
if errorlevel 1 (
    call :show_error "No se puede acceder al directorio del backend"
    call :styled_pause
    goto utilities
)

echo.
echo 🧹 LIMPIANDO CACHE DE NODE.JS:
call :section_separator "OPERACIONES DE LIMPIEZA"

if exist "node_modules" (
    echo 📦 Eliminando node_modules...
    rmdir /s /q node_modules >nul 2>&1
    if errorlevel 1 (
        call :show_error "Error al eliminar node_modules"
        echo Cierra todas las ventanas de Node.js y vuelve a intentar.
    ) else (
        call :show_success "node_modules eliminado"
    )
) else (
    call :show_info "node_modules no encontrado"
)

if exist "package-lock.json" (
    echo 🔒 Eliminando package-lock.json...
    del package-lock.json >nul 2>&1
    call :show_success "package-lock.json eliminado"
)

if exist "npm-debug.log" (
    echo 🐛 Eliminando logs de depuración...
    del npm-debug.log >nul 2>&1
    call :show_success "logs eliminados"
)

echo.
call :show_success "Limpieza de cache completada"
call :show_info "Ejecuta 'Iniciar Backend' para reinstalar dependencias"
call :styled_pause
goto utilities

:check_ports
call :show_header
echo                     🔍 PUERTOS EN USO - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo 📊 PUERTOS RELEVANTES:
call :section_separator "PUERTOS DEL SISTEMA"

echo 🔵 Puerto 3001 (Backend):
netstat -an | find ":3001" | find "LISTENING" >nul
if errorlevel 1 (call :show_success "✅ Libre") else (call :show_error "❌ En uso")

echo 🟠 Puerto 8080 (Keycloak):
netstat -an | find ":8080" | find "LISTENING" >nul
if errorlevel 1 (call :show_success "✅ Libre") else (call :show_error "❌ En uso")

echo 🟣 Puerto 19006 (Frontend):
netstat -an | find ":19006" | find "LISTENING" >nul
if errorlevel 1 (call :show_success "✅ Libre") else (call :show_error "❌ En uso")

echo.
call :show_info "Usa 'Detener Servicios' para liberar puertos en uso"
call :styled_pause
goto utilities

:check_processes
call :show_header
echo                     🖥️  PROCESOS ACTIVOS - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo 📋 PROCESOS DEL SISTEMA:
call :section_separator "PROCESOS EN EJECUCIÓN"

tasklist /fi "imagename eq node.exe" | find /i "node" >nul
if errorlevel 1 (
    call :show_info "No hay procesos Node.js activos"
) else (
    echo Procesos Node.js activos:
    tasklist /fi "imagename eq node.exe" /fo table
)

echo.
call :styled_pause
goto utilities

:stop_services
call :show_header
echo                     🛑 DETENER SERVICIOS - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

call :loading_animation "Deteniendo servicios del sistema"

echo.
echo 🔴 Deteniendo Backend y servicios Node.js...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.cmd >nul 2>&1
taskkill /f /im cmd.exe /t /fi "windowtitle eq 🔐 KEYCLOAK AUTH MANAGER*" >nul 2>&1

:: Limpiar procesos huérfanos
for /f "tokens=2" %%i in ('tasklist ^| findstr /i "node.*3001"') do (
    taskkill /f /pid %%i >nul 2>&1
)

call :show_success "Servicios KEYCLOAK AUTH MANAGER detenidos correctamente"

echo.
echo 🧹 Limpiando procesos residuales...
timeout /t 2 /nobreak >nul

:: Verificar que todo esté detenido
tasklist /fi "imagename eq node.exe" | find /i "node" >nul
if errorlevel 1 (
    call :show_success "Todos los servicios han sido detenidos"
) else (
    call :show_warning "Algunos servicios pueden seguir activos"
    echo Ejecuta 'Panel de Estado' para verificar.
)

call :styled_pause
goto main_menu

:help_center
call :show_header
echo                     📖 CENTRO DE AYUDA - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo     📚 DOCUMENTACIÓN
call :separator
echo     1. 🚀 Guía de Inicio Rápido
echo     2. 📋 Comandos Útiles
echo     3. 🔗 URLs y Puertos
echo.

echo     🛠️  SOPORTE TÉCNICO
call :separator
echo     4. 🐛 Solución de Problemas
echo     5. 🔧 Problemas de Administrador
echo     6. 🔙 Volver al Menú Principal
echo.

choice /C 123456 /N /M "🎯 Selecciona una opción de ayuda [1-6]: "

if %errorlevel% equ 1 goto quick_guide
if %errorlevel% equ 2 goto useful_commands
if %errorlevel% equ 3 goto urls_ports
if %errorlevel% equ 4 goto troubleshooting
if %errorlevel% equ 5 goto admin_issues
if %errorlevel% equ 6 goto main_menu

:quick_guide
call :show_header
echo                     📚 GUÍA DE INICIO RÁPIDO - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo 🎯 FLUJO DE TRABAJO RECOMENDADO:
call :section_separator "PROCESO RECOMENDADO"
echo 1. 🔐 Ejecutar el script como Administrador
echo 2. 🚀 Usar 'Inicio Rápido' desde el menú principal
echo 3. ✅ Verificar estado en Panel de Estado
echo 4. 🔄 Monitorear en Monitor en Tiempo Real
echo 5. ⚡ Iniciar Frontend manualmente: npm run web
echo.

echo ⚡ CONFIGURACIÓN INICIAL:
call :section_separator "REQUISITOS"
echo • Asegurar Node.js v16+ instalado
echo • Ejecutar como administrador
echo • Verificar directorio del proyecto
echo • Configurar variables de entorno
echo.

call :styled_pause
goto help_center

:troubleshooting
call :show_header
echo                     🐛 SOLUCIÓN DE PROBLEMAS - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo 🔍 PROBLEMAS COMUNES:
call :section_separator "SOLUCIONES"
echo ❌ "Node.js no encontrado"
echo    Solución: Instalar Node.js desde https://nodejs.org/
echo.
echo ❌ "Puerto ya en uso"
echo    Solución: Usar 'Detener Servicios' o cambiar puerto
echo.
echo ❌ "Error de permisos"
echo    Solución: Ejecutar como administrador
echo.
echo ❌ "Directorio no encontrado"
echo    Solución: Verificar rutas en el script
echo.

call :styled_pause
goto help_center

:admin_issues
call :show_header
echo                     🔧 PROBLEMAS DE ADMINISTRADOR
call :double_separator
echo.

echo 🛡️  SOLUCIÓN DE PROBLEMAS DE PERMISOS:
call :section_separator "PERMISOS Y ACCESO"
echo ❌ "Script no se ejecuta como administrador"
echo    Solución: Hacer clic derecho → "Ejecutar como administrador"
echo.
echo ❌ "Comandos bloqueados por UAC"
echo    Solución: Desactivar UAC temporalmente o confirmar prompts
echo.
echo ❌ "Procesos no se detienen"
echo    Solución: Usar el Task Manager como administrador
echo.
echo ❌ "Acceso denegado a puertos"
echo    Solución: Ejecutar PowerShell como administrador
echo.

call :styled_pause
goto help_center

:urls_ports
call :show_header
echo                     🔗 URLs Y PUERTOS - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo 🌐 URLS PRINCIPALES:
call :section_separator "ENDPOINTS"
echo 🔵 Health Check:    http://localhost:3001/api/health
echo 🟠 Keycloak Admin:  http://localhost:8080
echo 🟣 Frontend App:    http://localhost:19006
echo.

echo 🔌 PUERTOS UTILIZADOS:
call :section_separator "CONFIGURACIÓN DE RED"
echo 🔵 Backend API:    3001
echo 🟠 Keycloak:       8080
echo 🟣 Frontend:       19006
echo.

call :styled_pause
goto help_center

:useful_commands
call :show_header
echo                     📋 COMANDOS ÚTILES - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo ⚡ DESARROLLO:
call :section_separator "COMANDOS DE DESARROLLO"
echo • Iniciar Frontend:    npm run web
echo • Instalar dependencias: npm install
echo • Modo desarrollo:     npm run dev
echo.

echo 🔧 SISTEMA (Administrador):
call :section_separator "COMANDOS DE SISTEMA"
echo • Ver procesos:        tasklist /fi "imagename eq node.exe"
echo • Ver puertos:         netstat -anb ^| findstr LISTENING
echo • Matar proceso:       taskkill /f /im node.exe
echo • Ver permisos:        net session
echo.

call :styled_pause
goto help_center

:system_info
call :show_header
echo                     💡 INFORMACIÓN DEL SISTEMA - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo 📊 INFORMACIÓN GENERAL:
call :section_separator "DATOS DEL PROYECTO"
echo 🏷️  Proyecto:      KEYCLOAK AUTH MANAGER
echo 👨‍💻 Desarrollador: José Pablo Miranda Quintanilla
echo 📧 Contacto:      jmirandaquintanilla@gmail.com
echo 🏫 Institución:   Universidad Francisco Gavidia
echo 📦 Versión:       4.0.0
echo.

echo 🔧 INFORMACIÓN TÉCNICA:
call :section_separator "ESTADO DEL SISTEMA"
echo 📅 Fecha: %date%
echo ⏰ Hora:  %time%
echo 🔐 Permisos: Administrador
echo.

echo 🛠️  TECNOLOGÍAS:
call :section_separator "STACK TECNOLÓGICO"
echo • Frontend: React Native + Expo
echo • Backend: Node.js + Express
echo • Auth: Keycloak SSO
echo • Database: PostgreSQL
echo.

call :styled_pause
goto main_menu

:about
call :show_header
echo                     👨‍💻 ACERCA DEL PROYECTO - KEYCLOAK AUTH MANAGER
call :double_separator
echo.

echo 🎯 DESCRIPCIÓN:
call :section_separator "PROPÓSITO"
echo KEYCLOAK AUTH MANAGER es una solución integral de autenticación
echo Single Sign-On basada en Keycloak para la Universidad Francisco Gavidia.
echo.
echo Desarrollada para centralizar y simplificar la gestión de identidades
echo y accesos en aplicaciones institucionales.
echo.

echo ✨ CARACTERÍSTICAS PRINCIPALES:
call :section_separator "FUNCIONALIDADES"
echo • ✅ Gestión centralizada con permisos de administrador
echo • ✅ Monitoreo en tiempo real del sistema
echo • ✅ Reinicio automático con manejo de errores
echo • ✅ Interfaz intuitiva y diagnósticos avanzados
echo • ✅ Utilidades integradas para desarrollo
echo • ✅ Configuración rápida del entorno SSO
echo.

echo 📞 CONTACTO Y SOPORTE:
call :section_separator "INFORMACIÓN DE CONTACTO"
echo 👨‍💻 José Pablo Miranda Quintanilla
echo 📧 jmirandaquintanilla@gmail.com
echo 🏫 Universidad Francisco Gavidia
echo 🔧 Versión 4.0.0 - KEYCLOAK AUTH MANAGER
echo.

call :styled_pause
goto main_menu

:exit
call :show_header
echo.
echo 👋 ¡Gracias por usar KEYCLOAK AUTH MANAGER!
echo.
echo Desarrollado con ❤️ por José Pablo Miranda Quintanilla
echo 🏫 Universidad Francisco Gavidia • v4.0.0
echo.
call :loading_animation "Cerrando KEYCLOAK AUTH MANAGER"
exit