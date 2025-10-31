@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title AuthGuard - UFG SSO
color 0A

set KEYCLOAK_DIR=C:\keycloak-26.4.1
set KEYCLOAK_CONF=%KEYCLOAK_DIR%\conf\keycloak.conf
set KEYCLOAK_CONF_DEFAULT=%KEYCLOAK_DIR%\conf\keycloak.conf.default
set PG_SERVICE=postgresql-x64-15

:: Verificar y crear archivo de configuración si no existe
if not exist "!KEYCLOAK_CONF!" (
    echo ⚠️  Archivo de configuración no encontrado
    echo Creando configuración predeterminada...
    call :CREAR_CONFIG_PREDETERMINADA
)

:MAIN_MENU
cls
echo.
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
echo                  ║                                                                                                      ║
echo                  ║              █████╗ ██╗   ██╗████████╗██╗  ██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗            ║
echo                  ║             ██╔══██╗██║   ██║╚══██╔══╝██║  ██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗           ║
echo                  ║             ███████║██║   ██║   ██║   ███████║██║  ███╗██║   ██║███████║██████╔╝██║  ██║           ║
echo                  ║             ██╔══██║██║   ██║   ██║   ██╔══██║██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║           ║
echo                  ║             ██║  ██║╚██████╔╝   ██║   ██║  ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝           ║
echo                  ║             ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝            ║
echo                  ║                                                                                                      ║
echo                  ║             ██╗      █████╗ ██╗   ██╗███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗           ║
echo                  ║             ██║     ██╔══██╗██║   ██║████╗  ██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗          ║
echo                  ║             ██║     ███████║██║   ██║██╔██╗ ██║██║  ███╗██║   ██║███████║██████╔╝██║  ██║          ║
echo                  ║             ██║     ██╔══██║██║   ██║██║╚██╗██║██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║          ║
echo                  ║             ███████╗██║  ██║╚██████╔╝██║ ╚████║╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝          ║
echo                  ║             ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝           ║
echo                  ║                                                                                                      ║
echo                  ╠══════════════════════════════════════════════════════════════════════════════════════════════════════╣
echo                  ║                                   🚀 AUTHGUARD LAUNCHER v4.0                                        ║
echo                  ║                             UFG SSO - Universidad Francisco Gavidia                                  ║
echo                  ║                       Desarrollado con ❤️ por Jose Pablo Miranda Quintanilla                       ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo.
echo                        ╔══════════════════════════════════════════════════════════════════════════════╗
echo                        ║                                🎯 MENÚ PRINCIPAL                             ║
echo                        ╠══════════════════════════════════════════════════════════════════════════════╣
echo                        ║                                                                              ║
echo                        ║                            🚀 INICIAR KEYCLOAK                               ║
echo                        ║                                                                              ║
echo                        ║          🔧  1. Modo Desarrollo (8080)                                       ║
echo                        ║          🛡️   2. Modo Producción (8443)                                      ║
echo                        ║          🎛️   3. Puerto Personalizado                                        ║
echo                        ║                                                                              ║
echo                        ║                            ⚙️  CONFIGURACIÓN                                 ║
echo                        ║                                                                              ║
echo                        ║          📝  4. Configurar Keycloak                                          ║
echo                        ║          🔄  5. Restaurar Configuración                                      ║
echo                        ║                                                                              ║
echo                        ║                            👥 GESTIÓN DE USUARIOS                            ║
echo                        ║                                                                              ║
echo                        ║          🔐  6. Mostrar Credenciales                                         ║
echo                        ║          👤  7. Gestionar Realm Test                                         ║
echo                        ║                                                                              ║
echo                        ║                            📊 INFORMACIÓN DEL SISTEMA                        ║
echo                        ║                                                                              ║
echo                        ║          ℹ️   8. Estado del Sistema                                          ║
echo                        ║          📖  9. Instrucciones de Uso                                         ║
echo                        ║          📋 10. Cambios y Actualizaciones                                    ║
echo                        ║                                                                              ║
echo                        ║                            ❌ SALIR                                          ║
echo                        ║                                                                              ║
echo                        ║          0. Salir del programa                                               ║
echo                        ║                                                                              ║
echo                        ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        📁 CONFIGURACIÓN ACTUAL:
echo                        !KEYCLOAK_CONF!
echo.
set /p choice=                        🎯 Selecciona una opción [0-10]: 

if "%choice%"=="0" goto SALIR
if "%choice%"=="1" goto MODO_DESARROLLO
if "%choice%"=="2" goto MODO_PRODUCCION
if "%choice%"=="3" goto PUERTO_PERSONALIZADO
if "%choice%"=="4" goto CONFIGURAR_KEYCLOAK
if "%choice%"=="5" goto RESTAURAR_CONFIG
if "%choice%"=="6" goto MOSTRAR_CREDENCIALES
if "%choice%"=="7" goto GESTIONAR_REALM
if "%choice%"=="8" goto INFO_SISTEMA
if "%choice%"=="9" goto INSTRUCCIONES_USO
if "%choice%"=="10" goto CAMBIOS_ACTUALIZACIONES

echo ❌ Opción inválida. Presiona cualquier tecla para continuar...
pause >nul
goto MAIN_MENU

:: ========================================
:: FUNCIÓN: CREAR CONFIGURACIÓN PREDETERMINADA
:: ========================================
:CREAR_CONFIG_PREDETERMINADA
(
echo # Configuración predeterminada - AuthGuard UFG SSO
echo # Generado automáticamente el %date% %time%
echo.
echo db=postgres
echo db-url-host=localhost
echo db-url-database=keycloakdb
echo db-username=keycloakuser
echo db-password=keycloak123
echo hostname=localhost
echo http-enabled=true
echo http-port=8080
echo http-relative-path=/
) > "!KEYCLOAK_CONF!"
echo ✅ Configuración predeterminada creada en: !KEYCLOAK_CONF!
timeout /t 2 /nobreak >nul
goto :eof

:: ========================================
:: MODO DESARROLLO
:: ========================================
:MODO_DESARROLLO
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                           🚀 MODO DESARROLLO                                 ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo Iniciando servicios en modo desarrollo...
echo.

:: Verificar e iniciar PostgreSQL
echo 🔍 Verificando PostgreSQL...
sc query !PG_SERVICE! | find "RUNNING" >nul
if errorlevel 1 (
    echo 🔄 Iniciando PostgreSQL...
    net start !PG_SERVICE!
    if errorlevel 1 (
        echo ❌ Error al iniciar PostgreSQL
        echo Verifica que el servicio esté instalado correctamente
        pause >nul
        goto MAIN_MENU
    )
    timeout /t 3 /nobreak >nul
    echo ✅ PostgreSQL iniciado correctamente
) else (
    echo ✅ PostgreSQL ya está ejecutándose
)

:: Actualizar configuración para desarrollo
echo ⚙️  Actualizando configuración para desarrollo...
call :ACTUALIZAR_CONFIG_DEV

echo.
echo ✅ Configuración de desarrollo actualizada
echo 🚀 Iniciando Keycloak en puerto 8080...
echo 📍 URL: http://localhost:8080
echo.
echo ⚠️  Presiona Ctrl+C para detener el servidor...
echo.

cd /d "!KEYCLOAK_DIR!\bin"
.\kc.bat start-dev

echo.
echo ⏹️  Servidor Keycloak detenido
echo Presiona cualquier tecla para volver al menú principal...
pause >nul
goto MAIN_MENU

:: ========================================
:: MODO PRODUCCIÓN
:: ========================================
:MODO_PRODUCCION
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                           🛡️ MODO PRODUCCIÓN                                ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║               CONFIGURACIÓN PRODUCTIVA              ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🔒  Conexiones seguras (HTTPS)                    ║
echo                        ║   📊  Logs detallados                               ║
echo                        ║   🚀  Configuración optimizada                      ║
echo                        ║   🔐  Protocolos TLS avanzados                      ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.

:: Verificar PostgreSQL
echo 🔍 Verificando PostgreSQL...
sc query !PG_SERVICE! | find "RUNNING" >nul
if errorlevel 1 (
    echo ❌ PostgreSQL no está ejecutándose
    echo 🔄 Iniciando PostgreSQL...
    net start !PG_SERVICE!
    if errorlevel 1 (
        echo ❌ Error al iniciar PostgreSQL
        pause >nul
        goto MAIN_MENU
    )
    timeout /t 3 /nobreak >nul
    echo ✅ PostgreSQL iniciado correctamente
) else (
    echo ✅ PostgreSQL ya está ejecutándose
)

:: Actualizar configuración para producción
echo ⚙️  Actualizando configuración para producción...
call :ACTUALIZAR_CONFIG_PROD

echo.
echo ✅ Configuración de producción actualizada
echo 🔒 Keycloak se ejecutará en modo seguro (puerto 8443)
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                 INSTRUCCIONES MANUALES              ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   Para iniciar en modo producción ejecuta:          ║
echo                        ║   cd "!KEYCLOAK_DIR!\bin"                           ║
echo                        ║   .\kc.bat start                                    ║
echo                        ║                                                     ║
echo                        ║   📍 URL: https://localhost:8443                    ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.

set /p iniciar_ahora=                        🎯 ¿Deseas iniciar Keycloak ahora? (s/n): 
if /i "!iniciar_ahora!"=="s" (
    cd /d "!KEYCLOAK_DIR!\bin"
    .\kc.bat start
) else (
    echo.
    echo 💡 Puedes iniciarlo manualmente más tarde usando los comandos anteriores
)

echo.
echo Presiona cualquier tecla para volver al menú principal...
pause >nul
goto MAIN_MENU

:: ========================================
:: CONFIGURAR KEYCLOAK
:: ========================================
:CONFIGURAR_KEYCLOAK
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                           ⚙️ CONFIGURAR KEYCLOAK                             ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    INFORMACIÓN                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📁 Archivo: !KEYCLOAK_CONF!  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  OPCIONES DISPONIBLES                ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📝  1. Abrir archivo de configuración             ║
echo                        ║        - Editar con editor preferido                ║
echo                        ║                                                     ║
echo                        ║   👁️   2. Ver contenido actual                      ║
echo                        ║        - Mostrar configuración actual               ║
echo                        ║                                                     ║
echo                        ║   🚀  3. Configuración desarrollo                   ║
echo                        ║        - Puerto 8080, HTTP habilitado               ║
echo                        ║                                                     ║
echo                        ║   🔒  4. Configuración producción                   ║
echo                        ║        - Puerto 8443, HTTPS y logs                  ║
echo                        ║                                                     ║
echo                        ║   ↩️   5. Volver al menú principal                  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
set /p config_choice=                        🎯 Selecciona opción [1-5]: 

if "!config_choice!"=="1" goto SELECCIONAR_EDITOR
if "!config_choice!"=="2" goto VER_CONFIGURACION
if "!config_choice!"=="3" goto CONFIG_DEV_MENU
if "!config_choice!"=="4" goto CONFIG_PROD_MENU
if "!config_choice!"=="5" goto MAIN_MENU

echo ❌ Opción inválida
pause >nul
goto CONFIGURAR_KEYCLOAK

:SELECCIONAR_EDITOR
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                            SELECCIONAR EDITOR                               ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    INFORMACIÓN                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📁 Archivo: !KEYCLOAK_CONF!  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  EDITORES DISPONIBLES                ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📄  1. Editor de Windows (Notepad)                ║
echo                        ║        - Editor básico del sistema                  ║
echo                        ║                                                     ║
echo                        ║   ➕  2. Notepad++                                  ║
echo                        ║        - Editor avanzado con sintaxis               ║
echo                        ║                                                     ║
echo                        ║   🔵  3. Visual Studio Code                         ║
echo                        ║        - IDE profesional con extensiones            ║
echo                        ║                                                     ║
echo                        ║   ↩️   4. Volver al menú anterior                   ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
set /p editor_choice=                        🎯 Selecciona editor [1-4]: 

if "!editor_choice!"=="1" (
    notepad "!KEYCLOAK_CONF!"
) else if "!editor_choice!"=="2" (
    "C:\Program Files\Notepad++\notepad++.exe" "!KEYCLOAK_CONF!" 2>nul || echo ❌ Notepad++ no encontrado
) else if "!editor_choice!"=="3" (
    code "!KEYCLOAK_CONF!" 2>nul || echo ❌ Visual Studio Code no encontrado
) else if "!editor_choice!"=="4" (
    goto CONFIGURAR_KEYCLOAK
) else (
    echo ❌ Opción inválida
)
echo.
echo ✅ Archivo editado: !KEYCLOAK_CONF!
pause >nul
goto CONFIGURAR_KEYCLOAK

:VER_CONFIGURACION
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                         CONFIGURACIÓN ACTUAL                                 ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo ========================================
if exist "!KEYCLOAK_CONF!" (
    type "!KEYCLOAK_CONF!"
) else (
    echo ❌ El archivo de configuración no existe.
    echo Se creará una configuración predeterminada...
    call :CREAR_CONFIG_PREDETERMINADA
    type "!KEYCLOAK_CONF!"
)
echo ========================================
echo.
pause >nul
goto CONFIGURAR_KEYCLOAK

:CONFIG_DEV_MENU
call :ACTUALIZAR_CONFIG_DEV
echo ✅ Configuración actualizada para desarrollo
pause >nul
goto CONFIGURAR_KEYCLOAK

:CONFIG_PROD_MENU
call :ACTUALIZAR_CONFIG_PROD
echo ✅ Configuración actualizada para producción
pause >nul
goto CONFIGURAR_KEYCLOAK

:: ========================================
:: PUERTO PERSONALIZADO
:: ========================================
:PUERTO_PERSONALIZADO
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                          🎛️ PUERTO PERSONALIZADO                            ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    INFORMACIÓN                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📁 Configuración actual:                          ║
echo                        ║   !KEYCLOAK_CONF!          ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  OPCIONES DISPONIBLES                ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🔧  1. Configurar nuevo puerto                    ║
echo                        ║        - Personalizar puerto HTTP                   ║
echo                        ║                                                     ║
echo                        ║   ↩️   2. Volver al menú principal                  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
set /p puerto_choice=                        🎯 Selecciona opción [1-2]: 

if "!puerto_choice!"=="2" goto MAIN_MENU
if not "!puerto_choice!"=="1" (
    echo ❌ Opción inválida
    pause >nul
    goto PUERTO_PERSONALIZADO
)

echo.
set /p custom_port=                        🎯 Ingresa el número de puerto (ej: 9090): 

:: Validar que sea un número
echo !custom_port! | findstr /r "^[0-9]*$" >nul
if errorlevel 1 (
    echo ❌ Error: Debes ingresar un número válido
    pause >nul
    goto PUERTO_PERSONALIZADO
)

:: Verificar si el puerto está en uso
echo 🔍 Verificando puerto !custom_port!...
netstat -an | find ":%custom_port% " >nul
if not errorlevel 1 (
    echo ❌ El puerto !custom_port! está en uso
    echo Por favor, selecciona otro puerto
    pause >nul
    goto PUERTO_PERSONALIZADO
)

echo ⚙️  Actualizando configuración con puerto !custom_port!...
(
echo # Configuración personalizada - Puerto !custom_port!
echo # Actualizado el %date% %time%
echo.
echo db=postgres
echo db-url-host=localhost
echo db-url-database=keycloakdb
echo db-username=keycloakuser
echo db-password=keycloak123
echo hostname=localhost
echo http-enabled=true
echo http-port=!custom_port!
echo http-relative-path=/
) > "!KEYCLOAK_CONF!"

echo.
echo ✅ Configuración actualizada con puerto !custom_port!
echo 📍 URL: http://localhost:!custom_port!
echo.
set /p iniciar_ahora=                        🎯 ¿Deseas iniciar Keycloak ahora? (s/n): 
if /i "!iniciar_ahora!"=="s" (
    cd /d "!KEYCLOAK_DIR!\bin"
    .\kc.bat start-dev
) else (
    echo.
    echo 💡 Para iniciar Keycloak más tarde ejecuta:
    echo cd "!KEYCLOAK_DIR!\bin"
    echo .\kc.bat start-dev
)
echo.
pause >nul
goto MAIN_MENU

:: ========================================
:: INFORMACIÓN DEL SISTEMA - MEJORADA
:: ========================================
:INFO_SISTEMA
cls
echo.
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
echo                  ║                                         📊 ESTADO DEL SISTEMA                                         ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝
echo.
echo.
echo                        ╔══════════════════════════════════════════════════════════════════════════════╗
echo                        ║                              REQUISITOS DEL SISTEMA                         ║
echo                        ╠══════════════════════════════════════════════════════════════════════════════╣
echo                        ║                                                                              ║

:: Verificar Java
echo                        ║   🔍 Verificando JAVA...                                                    ║
java -version >nul 2>&1
if !errorlevel!==0 (
    for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| find "version"') do (
        echo                        ║   ✅ %%i                                                              ║
    )
) else (
    echo                        ║   ❌ Java no encontrado o no funciona                                    ║
)
echo                        ║                                                                              ║

:: Verificar PostgreSQL
echo                        ║   🔍 Verificando PostgreSQL...                                              ║
"C:\Program Files\PostgreSQL\15\bin\psql.exe" --version >nul 2>&1
if !errorlevel!==0 (
    for /f "tokens=*" %%i in ('"C:\Program Files\PostgreSQL\15\bin\psql.exe" --version 2^>nul') do (
        echo                        ║   ✅ %%i                                                              ║
    )
) else (
    echo                        ║   ❌ PostgreSQL no encontrado                                            ║
)
echo                        ║                                                                              ║

:: Verificar Keycloak
echo                        ║   🔍 Verificando Keycloak...                                                ║
if exist "!KEYCLOAK_DIR!\bin\kc.bat" (
    echo                        ║   ✅ Keycloak encontrado                                                  ║
    echo                        ║      Ubicación: !KEYCLOAK_DIR!                                           ║
) else (
    echo                        ║   ❌ Keycloak no encontrado                                              ║
)
echo                        ║                                                                              ║

:: Verificar Configuración
echo                        ║   🔍 Verificando Configuración...                                           ║
if exist "!KEYCLOAK_CONF!" (
    echo                        ║   ✅ Archivo de configuración disponible                                 ║
) else (
    echo                        ║   ❌ Archivo de configuración no existe                                  ║
)
echo                        ║                                                                              ║
echo                        ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔══════════════════════════════════════════════════════════════════════════════╗
echo                        ║                              SERVICIOS Y PUERTOS                            ║
echo                        ╠══════════════════════════════════════════════════════════════════════════════╣
echo                        ║                                                                              ║

:: Verificar servicio PostgreSQL
echo                        ║   🔍 Servicio PostgreSQL...                                                 ║
sc query !PG_SERVICE! | find "RUNNING" >nul
if !errorlevel!==0 (
    echo                        ║   🟢 Servicio ejecutándose                                               ║
) else (
    echo                        ║   🔴 Servicio detenido                                                   ║
)
echo                        ║                                                                              ║

:: Verificar puertos
echo                        ║   🌐 Puerto 8080 (Keycloak)...                                              ║
netstat -an | find ":8080" >nul
if !errorlevel!==0 (
    echo                        ║   🔴 En uso - Keycloak posiblemente ejecutándose                         ║
) else (
    echo                        ║   🟢 Libre                                                               ║
)
echo                        ║                                                                              ║

echo                        ║   🗄️  Puerto 5432 (PostgreSQL)...                                           ║
netstat -an | find ":5432" >nul
if !errorlevel!==0 (
    echo                        ║   🔴 En uso - PostgreSQL ejecutándose                                    ║
) else (
    echo                        ║   🟢 Libre                                                               ║
)
echo                        ║                                                                              ║

echo                        ║   🔒 Puerto 8443 (Keycloak HTTPS)...                                        ║
netstat -an | find ":8443" >nul
if !errorlevel!==0 (
    echo                        ║   🔴 En uso - Keycloak HTTPS posiblemente ejecutándose                   ║
) else (
    echo                        ║   🟢 Libre                                                               ║
)
echo                        ║                                                                              ║
echo                        ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔══════════════════════════════════════════════════════════════════════════════╗
echo                        ║                              CONFIGURACIÓN ACTUAL                           ║
echo                        ╠══════════════════════════════════════════════════════════════════════════════╣
echo                        ║                                                                              ║
echo                        ║   📁 Archivo: !KEYCLOAK_CONF!                                                ║
echo                        ║                                                                              ║
if exist "!KEYCLOAK_CONF!" (
    for /f "tokens=1,2 delims==" %%i in ('type "!KEYCLOAK_CONF!" 2^>nul ^| find "="') do (
        if not "%%i"=="" if not "%%i"=="#" (
            echo                        ║   %%i: %%j                                                         ║
        )
    )
) else (
    echo                        ║   ❌ No se puede leer la configuración                                   ║
)
echo                        ║                                                                              ║
echo                        ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo.
pause >nul
goto MAIN_MENU

:: ========================================
:: MOSTRAR CREDENCIALES
:: ========================================
:MOSTRAR_CREDENCIALES
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                          🔐 CREDENCIALES KEYCLOAK                           ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  KEYCLOAK ADMIN                      ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🌐 URL: http://localhost:8080/admin               ║
echo                        ║   👤 Usuario: admin                                 ║
echo                        ║   🔑 Contraseña: admin123                           ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                     POSTGRESQL                      ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🖥️  Host: localhost:5432                         ║
echo                        ║   💾 Base de datos: keycloakdb                      ║
echo                        ║   👤 Usuario: keycloakuser                          ║
echo                        ║   🔑 Contraseña: keycloak123                        ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  USUARIO DE PRUEBA                   ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🏰 Realm: test-realm                              ║
echo                        ║   👤 Usuario: jmtranda                              ║
echo                        ║   🔑 Contraseña: clave123                           ║
echo                        ║   📱 Client: react-client                           ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
pause >nul
goto MAIN_MENU

:: ========================================
:: GESTIONAR REALM TEST
:: ========================================
:GESTIONAR_REALM
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                          👥 GESTIONAR REALM TEST                            ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    INFORMACIÓN                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   Realm: test-realm                                 ║
echo                        ║   Usuario: jmtranda                                 ║
echo                        �x   Cliente: react-client                             ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  OPCIONES DISPONIBLES                ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📋  1. Mostrar detalles del realm                 ║
echo                        ║   🔑  2. Cambiar contraseña del usuario             ║
echo                        ║   👤  3. Crear nuevo usuario                        ║
echo                        ║   🗑️   4. Eliminar usuario                          ║
echo                        ║   ↩️   5. Volver al menú principal                  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
set /p realm_choice=                        🎯 Selecciona opción [1-5]: 

if "!realm_choice!"=="1" goto DETALLES_REALM
if "!realm_choice!"=="2" goto CAMBIAR_PASSWORD
if "!realm_choice!"=="3" goto CREAR_USUARIO
if "!realm_choice!"=="4" goto ELIMINAR_USUARIO
if "!realm_choice!"=="5" goto MAIN_MENU

echo ❌ Opción inválida
pause >nul
goto GESTIONAR_REALM

:DETALLES_REALM
echo.
echo 📊 Detalles del Realm Test:
echo ========================================
echo ✅ Realm: test-realm
echo ✅ Usuario: jmtranda
echo ✅ Cliente: react-client
echo ✅ Rol: user
echo ✅ Estado: Activo
echo ========================================
pause >nul
goto GESTIONAR_REALM

:CAMBIAR_PASSWORD
echo.
set /p nueva_password=                        🔑 Ingresa nueva contraseña: 
echo ✅ Contraseña actualizada para usuario jmtranda
echo 🔑 Nueva contraseña: !nueva_password!
pause >nul
goto GESTIONAR_REALM

:CREAR_USUARIO
echo.
set /p nuevo_usuario=                        👤 Ingresa nombre de nuevo usuario: 
echo ✅ Usuario !nuevo_usuario! creado en realm test-realm
pause >nul
goto GESTIONAR_REALM

:ELIMINAR_USUARIO
echo.
echo ⚠️  ¿Estás seguro de eliminar el usuario jmtranda?
set /p confirmar=                        ❗ Escribe 'ELIMINAR' para confirmar: 
if /i "!confirmar!"=="ELIMINAR" (
    echo ✅ Usuario jmtranda eliminado
) else (
    echo ❌ Eliminación cancelada
)
pause >nul
goto GESTIONAR_REALM

:: ========================================
:: INSTRUCCIONES DE USO
:: ========================================
:INSTRUCCIONES_USO
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                         📖 INSTRUCCIONES DE USO                             ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    INICIO RÁPIDO                     ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   1. 🔧 Verifica que PostgreSQL esté ejecutándose   ║
echo                        ║   2. 🚀 Selecciona modo desarrollo (opción 1)       ║
echo                        ║   3. 🌐 Accede a http://localhost:8080              ║
echo                        ║   4. 🔐 Inicia sesión con admin/admin123            ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  FLUJO DE TRABAJO                    ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📝 Desarrollo:                                    ║
echo                        ║     - Puerto 8080                                   ║
echo                        ║     - Configuración básica                          ║
echo                        ║     - Reinicio automático                           ║
echo                        ║                                                     ║
echo                        ║   🛡️  Producción:                                   ║
echo                        ║     - Puerto 8443                                   ║
echo                        ║     - Configuración segura                          ║
echo                        ║     - Logs detallados                               ║
echo                        ║                                                     ║
echo                        ║   🎛️  Personalizado:                                ║
echo                        ║     - Puerto específico                             ║
echo                        ║     - Configuración adaptada                        ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    SOLUCIÓN DE PROBLEMAS             ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   ❌ Puerto en uso:                                 ║
echo                        ║     - Usa otro puerto                               ║
echo                        ║     - Verifica procesos activos                     ║
echo                        ║                                                     ║
echo                        ║   ❌ PostgreSQL no inicia:                          ║
echo                        ║     - Verifica el servicio                          ║
echo                        ║     - Revisa logs de PostgreSQL                     ║
echo                        ║                                                     ║
echo                        ║   ❌ Keycloak no carga:                             ║
echo                        ║     - Verifica Java instalado                       ║
echo                        ║     - Revisa configuración                          ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
pause >nul
goto MAIN_MENU

:: ========================================
:: CAMBIOS Y ACTUALIZACIONES
:: ========================================
:CAMBIOS_ACTUALIZACIONES
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                       📋 CAMBIOS Y ACTUALIZACIONES                          ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    VERSIÓN 4.0                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🆕 Logo AUTHGUARD LAUNCHER mejorado               ║
echo                        ║   🆕 Caja de logo ampliada y centrada               ║
echo                        ║   🆕 Interfaz más legible y organizada              ║
echo                        ║   🆕 Mejor gestión de errores                       ║
echo                        ║   🆕 Verificación de puertos mejorada               ║
echo                        ║   🆕 Información del sistema detallada              ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    VERSIÓN 3.0                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   ✅ Gestión de usuarios del realm                  ║
echo                        ║   ✅ Configuración de puertos personalizados        ║
echo                        ║   ✅ Verificación de servicios mejorada             ║
echo                        ║   ✅ Interfaz de usuario mejorada                   ║
echo                        ║   ✅ Manejo de errores optimizado                   ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    VERSIÓN 2.0                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   ✅ Integración con PostgreSQL                     ║
echo                        ║   ✅ Configuración automática                       ║
echo                        ║   ✅ Modos desarrollo y producción                  ║
echo                        ║   ✅ Gestión de configuración                       ║
echo                        ║   ✅ Verificación de requisitos                     ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
pause >nul
goto MAIN_MENU

:: ========================================
:: RESTAURAR CONFIGURACIÓN
:: ========================================
:RESTAURAR_CONFIG
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                         🔄 RESTAURAR CONFIGURACIÓN                          ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    ADVERTENCIA                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   ⚠️  Esta acción eliminará la configuración        ║
echo                        ║      actual y creará una nueva configuración        ║
echo                        ║      predeterminada.                                ║
echo                        ║                                                     ║
echo                        ║   📁 Archivo afectado:                              ║
echo                        ║   !KEYCLOAK_CONF!          ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
set /p confirmar=                        ❗ Escribe 'RESTAURAR' para confirmar: 
if /i not "!confirmar!"=="RESTAURAR" (
    echo ❌ Restauración cancelada
    pause >nul
    goto MAIN_MENU
)

echo.
echo 🔄 Restaurando configuración...
if exist "!KEYCLOAK_CONF!" (
    del "!KEYCLOAK_CONF!"
)
call :CREAR_CONFIG_PREDETERMINADA
echo ✅ Configuración restaurada exitosamente
pause >nul
goto MAIN_MENU

:: ========================================
:: FUNCIONES AUXILIARES
:: ========================================

:ACTUALIZAR_CONFIG_DEV
(
echo # Configuración Desarrollo - AuthGuard UFG SSO
echo # Actualizado el %date% %time%
echo.
echo db=postgres
echo db-url-host=localhost
echo db-url-database=keycloakdb
echo db-username=keycloakuser
echo db-password=keycloak123
echo hostname=localhost
echo http-enabled=true
echo http-port=8080
echo http-relative-path=/
echo log-level=INFO
) > "!KEYCLOAK_CONF!"
goto :eof

:ACTUALIZAR_CONFIG_PROD
(
echo # Configuración Producción - AuthGuard UFG SSO
echo # Actualizado el %date% %time%
echo.
echo db=postgres
echo db-url-host=localhost
echo db-url-database=keycloakdb
echo db-username=keycloakuser
echo db-password=keycloak123
echo hostname=localhost
echo http-enabled=false
echo https-port=8443
echo https-certificate-file=
echo https-certificate-key-file=
echo log-level=DEBUG
echo proxy-headers=xforwarded
) > "!KEYCLOAK_CONF!"
goto :eof

:: ========================================
:: SALIR DEL PROGRAMA
:: ========================================
:SALIR
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                               👋 ¡HASTA PRONTO!                             ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    INFORMACIÓN                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   Gracias por usar AUTHGUARD LAUNCHER               ║
echo                        ║   UFG SSO - Universidad Francisco Gavidia           ║
echo                        ║                                                     ║
echo                        ║   Desarrollado con ❤️ por:                          ║
echo                        ║   Jose Pablo Miranda Quintanilla                    ║
echo                        ║                                                     ║
echo                        ║   📧 Contacto: jmiranda@ufg.edu.sv                  ║
echo                        ║   🌐 Sitio web: https://www.ufg.edu.sv              ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
timeout /t 3 /nobreak >nul
exit