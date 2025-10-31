@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title Heychool Launcher - UFG SSO
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
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                                                                              ║
echo                  ║    ██╗  ██╗███████╗██╗   ██╗ ██████╗██╗  ██╗ ██████╗ ██████╗ ██████╗ ██╗     ║
echo                  ║    ██║ ██╔╝██╔════╝╚██╗ ██╔╝██╔════╝██║  ██║██╔═══██╗██╔══██╗██╔══██╗██║     ║
echo                  ║    █████╔╝ █████╗   ╚████╔╝ ██║     ███████║██║   ██║██║  ██║██████╔╝██║     ║
echo                  ║    ██╔═██╗ ██╔══╝    ╚██╔╝  ██║     ██╔══██║██║   ██║██║  ██║██╔══██╗██║     ║
echo                  ║    ██║  ██╗███████╗   ██║   ╚██████╗██║  ██║╚██████╔╝██████╔╝██║  ██║███████╗║
echo                  ║    ╚═╝  ╚═╝╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝║
echo                  ║                                                                              ║
echo                  ║    ██╗      █████╗ ██╗   ██╗███╗   ██╗ ██████╗██╗  ██╗███████╗██████╗        ║
echo                  ║    ██║     ██╔══██╗██║   ██║████╗  ██║██╔════╝██║  ██║██╔════╝██╔══██╗       ║
echo                  ║    ██║     ███████║██║   ██║██╔██╗ ██║██║     ███████║█████╗  ██████╔╝       ║
echo                  ║    ██║     ██╔══██║██║   ██║██║╚██╗██║██║     ██╔══██║██╔══╝  ██╔══██╗       ║
echo                  ║    ███████╗██║  ██║╚██████╔╝██║ ╚████║╚██████╗██║  ██║███████╗██║  ██║       ║
echo                  ║    ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝       ║
echo                  ║                                                                              ║
echo                  ╠══════════════════════════════════════════════════════════════════════════════╣
echo                  ║                    UFG SSO - Universidad Francisco Gavidia                  ║
echo                  ║              Desarrollado con ❤️ por Jose Pablo Miranda Quintanilla         ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                     MENÚ PRINCIPAL                   ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🚀  1. Modo Desarrollo (8080)                     ║
echo                        ║        - Inicio rápido para desarrollo               ║
echo                        ║                                                     ║
echo                        ║   🔒  2. Modo Producción                            ║
echo                        ║        - Configuración optimizada                   ║
echo                        ║                                                     ║
echo                        ║   ⚙️   3. Configurar Keycloak                       ║
echo                        ║        - Editar keycloak.conf                       ║
echo                        ║                                                     ║
echo                        ║   🔧  4. Puerto Personalizado                       ║
echo                        ║        - Configurar puerto específico               ║
echo                        ║                                                     ║
echo                        ║   📊  5. Información del Sistema                    ║
echo                        ║        - Java, PostgreSQL y Keycloak                ║
echo                        ║                                                     ║
echo                        ║   🔐  6. Mostrar Credenciales                       ║
echo                        ║        - Usuarios y contraseñas                     ║
echo                        ║                                                     ║
echo                        ║   👥  7. Gestionar Realm Test                       ║
echo                        ║        - Crear y administrar realm de prueba        ║
echo                        ║                                                     ║
echo                        ║   🔄  8. Restaurar Configuración                    ║
echo                        ║        - Configuración original                     ║
echo                        ║                                                     ║
echo                        ║   📖  9. Instrucciones de Uso                       ║
echo                        ║        - Guía completa de instalación               ║
echo                        ║                                                     ║
echo                        ║   📋  10. Cambios y Actualizaciones                 ║
echo                        ║        - Historial de versiones                     ║
echo                        ║                                                     ║
echo                        ║   ❌   0. Salir                                     ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        📁 CONFIGURACIÓN ACTUAL:
echo                        !KEYCLOAK_CONF!
echo.
set /p choice=                        🎯 Selecciona una opción [0-10]: 

if "%choice%"=="0" goto SALIR
if "%choice%"=="1" goto MODO_DESARROLLO
if "%choice%"=="2" goto MODO_PRODUCCION
if "%choice%"=="3" goto CONFIGURAR_KEYCLOAK
if "%choice%"=="4" goto PUERTO_PERSONALIZADO
if "%choice%"=="5" goto INFO_SISTEMA
if "%choice%"=="6" goto MOSTRAR_CREDENCIALES
if "%choice%"=="7" goto GESTIONAR_REALM
if "%choice%"=="8" goto RESTAURAR_CONFIG
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
echo # Configuración predeterminada - Heychool Launcher UFG SSO
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
echo                  ║                               MODO DESARROLLO                                ║
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
echo                  ║                               MODO PRODUCCIÓN                                ║
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
echo                  ║                            CONFIGURAR KEYCLOAK                               ║
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
echo                  ║                          PUERTO PERSONALIZADO                                ║
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
:: INFORMACIÓN DEL SISTEMA
:: ========================================
:INFO_SISTEMA
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                         INFORMACIÓN DEL SISTEMA                             ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                   ESTADO DEL SISTEMA                 ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📊 JAVA:                                         ║
java -version 2>&1 | find "version" >nul && echo    ✅ Java encontrado y funcional || echo    ❌ Java no encontrado
echo                        ║                                                     ║
echo                        ║   🗄️  POSTGRESQL:                                  ║
"C:\Program Files\PostgreSQL\15\bin\psql.exe" --version 2>nul && echo    ✅ PostgreSQL instalado || echo    ❌ PostgreSQL no encontrado
echo                        ║                                                     ║
echo                        ║   🔐 KEYCLOAK:                                     ║
if exist "!KEYCLOAK_DIR!\bin\kc.bat" (
    echo    ✅ Keycloak encontrado en: !KEYCLOAK_DIR!
) else (
    echo    ❌ Keycloak no encontrado
)
echo                        ║                                                     ║
echo                        ║   📁 CONFIGURACIÓN:                                ║
if exist "!KEYCLOAK_CONF!" (
    echo    ✅ Archivo de configuración disponible
) else (
    echo    ❌ Archivo de configuración no encontrado
)
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    PUERTOS EN USO                    ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
netstat -an | find ":8080" >nul && echo    ✅ Puerto 8080: En uso || echo    🔵 Puerto 8080: Libre
netstat -an | find ":5432" >nul && echo    ✅ Puerto 5432: PostgreSQL || echo    🔵 Puerto 5432: Libre
netstat -an | find ":8443" >nul && echo    ✅ Puerto 8443: En uso || echo    🔵 Puerto 8443: Libre
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
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
echo                  ║                          CREDENCIALES KEYCLOAK                               ║
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
echo                  ║                          GESTIONAR REALM TEST                               ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  OPCIONES DISPONIBLES                ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🖥️   1. Abrir consola de administración          ║
echo                        ║        - Acceder al panel web                       ║
echo                        ║                                                     ║
echo                        ║   👤  2. Crear usuario de prueba                    ║
echo                        ║        - Instrucciones paso a paso                  ║
echo                        ║                                                     ║
echo                        ║   🔗  3. Ver URL del realm                          ║
echo                        ║        - Endpoints disponibles                      ║
echo                        ║                                                     ║
echo                        ║   ↩️   4. Volver al menú principal                  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
set /p realm_choice=                        🎯 Selecciona opción [1-4]: 

if "!realm_choice!"=="1" (
    start http://localhost:8080/admin
    echo ✅ Consola de administración abierta
) else if "!realm_choice!"=="2" (
    echo.
    echo                        ╔═════════════════════════════════════════════════════╗
    echo                        ║              CREAR USUARIO DE PRUEBA                 ║
    echo                        ╠═════════════════════════════════════════════════════╣
    echo                        ║                                                     ║
    echo                        ║   📋 Pasos para crear usuario:                      ║
    echo                        ║                                                     ║
    echo                        ║   1. 🌐 Acceder a http://localhost:8080/admin       ║
    echo                        ║   2. 🏰 Seleccionar Realm: test-realm               ║
    echo                        ║   3. 👥 Users ^> Add user                           ║
    echo                        ║   4. 📛 Username: jmtranda                          ║
    echo                        ║   5. 🔑 Credentials ^> Password: clave123           ║
    echo                        ║      (Temporal: OFF)                                ║
    echo                        ║                                                     ║
    echo                        ╚═════════════════════════════════════════════════════╝
) else if "!realm_choice!"=="3" (
    echo.
    echo                        ╔═════════════════════════════════════════════════════╗
    echo                        ║                  URLS DEL REALM                     ║
    echo                        ╠═════════════════════════════════════════════════════╣
    echo                        ║                                                     ║
    echo                        ║   🛠️  Admin: http://localhost:8080/admin           ║
    echo                        ║   👤 Account: http://localhost:8080/realms/         ║
    echo                        ║        test-realm/account                           ║
    echo                        ║   🔗 OIDC Config: http://localhost:8080/realms/     ║
    echo                        ║        test-realm/.well-known/openid-configuration  ║
    echo                        ║                                                     ║
    echo                        ╚═════════════════════════════════════════════════════╝
) else if "!realm_choice!"=="4" (
    goto MAIN_MENU
) else (
    echo ❌ Opción inválida
)
pause >nul
goto GESTIONAR_REALM

:: ========================================
:: RESTAURAR CONFIGURACIÓN
:: ========================================
:RESTAURAR_CONFIG
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                         RESTAURAR CONFIGURACIÓN                              ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo ⚠️  Esta acción sobrescribirá la configuración actual
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                    INFORMACIÓN                       ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📁 Archivo: !KEYCLOAK_CONF!  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
set /p confirmar=                        🎯 ¿Estás seguro de que deseas continuar? (s/n): 
if /i "!confirmar!"=="s" (
    call :CREAR_CONFIG_PREDETERMINADA
    echo ✅ Configuración restaurada correctamente
) else (
    echo ❌ Operación cancelada
)
pause >nul
goto MAIN_MENU

:: ========================================
:: INSTRUCCIONES DE USO
:: ========================================
:INSTRUCCIONES_USO
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                         INSTRUCCIONES DE USO                                 ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║               GUÍA DE INSTALACIÓN PASO A PASO        ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   1. 📥 DESCARGAR KEYCLOAK                         ║
echo                        ║      - Descargar Keycloak 26.4.1 oficial            ║
echo                        ║      - Extraer ZIP en disco local C:\               ║
echo                        ║      - Ruta final: C:\keycloak-26.4.1               ║
echo                        ║                                                     ║
echo                        ║   2. 📁 COLOCAR EL SCRIPT                          ║
echo                        ║      - Copiar 'keycloak-launcher.bat' en:          ║
echo                        ║      - C:\keycloak-26.4.1\bin                       ║
echo                        ║                                                     ║
echo                        ║   3. ⚡ EJECUTAR EL SCRIPT                          ║
echo                        ║      - Clic derecho como administrador              ║
echo                        ║      - Esperar carga del menú principal             ║
echo                        ║                                                     ║
echo                        ║   4. 🚀 DISFRUTAR                                   ║
echo                        ║      - Seleccionar 'Modo Desarrollo (8080)'         ║
echo                        ║      - Acceder a http://localhost:8080              ║
echo                        ║      - Usar credenciales del menú                   ║
echo                        ║                                                     ║
echo                        ║   5. 🔄 REGRESAR AL MENÚ                            ║
echo                        ║      - Usar opciones 'Volver' en submenús           ║
echo                        ║      - Ctrl+C si servidor ejecutándose              ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║               CONFIGURACIÓN ADICIONAL                ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   📋 PostgreSQL instalado y configurado             ║
echo                        ║   ☕ Java 11 o superior instalado                    ║
echo                        ║   🚦 Servicio PostgreSQL en ejecución               ║
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
echo                  ║                        CAMBIOS Y ACTUALIZACIONES                             ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  HISTORIAL DE VERSIONES              ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🟢 VERSIÓN 3.1 - Mejoras de Interfaz:             ║
echo                        ║      ✓ Cajas más grandes y mejor alineadas          ║
echo                        ║      ✓ Logo HEYCHOOL LAUNCHER completo              ║
echo                        ║      ✓ Diseño visual más profesional                ║
echo                        ║      ✓ Mejor organización de elementos              ║
echo                        ║      ✓ Iconos y emojis consistentes                 ║
echo                        ║                                                     ║
echo                        ║   🟢 VERSIÓN 3.0 - Actualizaciones Actuales:        ║
echo                        ║      ✓ Interfaz centrada y mejorada                 ║
echo                        ║      ✓ Logo ASCII mejorado                          ║
echo                        ║      ✓ Opciones alineadas al centro                 ║
echo                        ║                                                     ║
echo                        ║   🟡 VERSIÓN 2.0 - Mejoras Previas:                 ║
echo                        ║      ✓ Detección automática de configuración        ║
echo                        ║      ✓ Validación mejorada de puertos               ║
echo                        ║      ✓ Funciones auxiliares reutilizables           ║
echo                        ║      ✓ Mejor manejo de errores                      ║
echo                        ║                                                     ║
echo                        ║   🔵 VERSIÓN 1.0 - Versión Inicial:                 ║
echo                        ║      ✓ Menú principal con opciones básicas          ║
echo                        ║      ✓ Modo desarrollo y producción                 ║
echo                        ║      ✓ Configuración de Keycloak                    ║
echo                        ║      ✓ Gestión de Realm test                        ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                 PRÓXIMAS ACTUALIZACIONES             ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   🔮 Configuración automática de realms             ║
echo                        ║   💾 Backup y restauración de configuraciones       ║
echo                        ║   🖥️  Interfaz gráfica alternativa                  ║
echo                        ║   🔄 Soporte para múltiples versiones               ║
echo                        ║   📊 Monitorización en tiempo real                  ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                       DESARROLLADOR                  ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   👨‍💻 Jose Pablo Miranda Quintanilla              ║
echo                        ║   🎓 Universidad Francisco Gavidia                  ║
echo                        ║   🔐 Proyecto UFG SSO                              ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
pause >nul
goto MAIN_MENU

:: ========================================
:: FUNCIONES AUXILIARES
:: ========================================

:ACTUALIZAR_CONFIG_DEV
(
echo # Configuración Desarrollo - Heychool Launcher UFG SSO
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
) > "!KEYCLOAK_CONF!"
goto :eof

:ACTUALIZAR_CONFIG_PROD
(
echo # Configuración Producción - Heychool Launcher UFG SSO
echo # Actualizado el %date% %time%
echo.
echo db=postgres
echo db-url-host=localhost
echo db-url-database=keycloakdb
echo db-username=keycloakuser
echo db-password=keycloak123
echo hostname=localhost
echo http-enabled=true
echo http-port=8443
echo http-relative-path=/
echo proxy-headers=xforwarded
echo https-protocols=TLSv1.3,TLSv1.2
echo log-level=INFO
) > "!KEYCLOAK_CONF!"
goto :eof

:: ========================================
:: SALIR
:: ========================================
:SALIR
cls
echo.
echo                  ╔══════════════════════════════════════════════════════════════════════════════╗
echo                  ║                                 ¡HASTA PRONTO!                               ║
echo                  ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo                        ╔═════════════════════════════════════════════════════╗
echo                        ║                  AGRADECIMIENTOS                     ║
echo                        ╠═════════════════════════════════════════════════════╣
echo                        ║                                                     ║
echo                        ║   👋 Gracias por usar Heychool Launcher            ║
echo                        ║   🎓 Universidad Francisco Gavidia                  ║
echo                        ║   👨‍💻 Desarrollado por: Jose Pablo Miranda        ║
echo                        ║        Quintanilla                                 ║
echo                        ║                                                     ║
echo                        ╚═════════════════════════════════════════════════════╝
echo.
echo Presiona cualquier tecla para salir...
pause >nul
exit