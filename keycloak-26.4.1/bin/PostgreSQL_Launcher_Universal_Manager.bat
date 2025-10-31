@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title PostgreSQL Launcher - Universal Manager
color 0B

:: Detectar automáticamente la instalación de PostgreSQL
set PG_DIR=
set PG_BIN=
set PG_DATA=

:: Buscar PostgreSQL en ubicaciones comunes
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" (
    set PG_DIR=C:\Program Files\PostgreSQL\15
    set PG_BIN=C:\Program Files\PostgreSQL\15\bin
    set PG_DATA=C:\Program Files\PostgreSQL\15\data
) else if exist "C:\Program Files\PostgreSQL\14\bin\psql.exe" (
    set PG_DIR=C:\Program Files\PostgreSQL\14
    set PG_BIN=C:\Program Files\PostgreSQL\14\bin
    set PG_DATA=C:\Program Files\PostgreSQL\14\data
) else if exist "C:\Program Files\PostgreSQL\13\bin\psql.exe" (
    set PG_DIR=C:\Program Files\PostgreSQL\13
    set PG_BIN=C:\Program Files\PostgreSQL\13\bin
    set PG_DATA=C:\Program Files\PostgreSQL\13\data
) else (
    echo 🔍 Buscando instalación de PostgreSQL...
    for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
        if exist "%%i\bin\psql.exe" (
            set PG_DIR=%%i
            set PG_BIN=%%i\bin
            set PG_DATA=%%i\data
        )
    )
)

:: Si no se encuentra PostgreSQL, pedir configuración manual
if "!PG_BIN!"=="" (
    echo ❌ PostgreSQL no encontrado automáticamente
    echo 📁 Por favor, configura la ruta manualmente
    call :CONFIGURAR_RUTA_MANUAL
)

set PG_SERVICE=postgresql-x64-15
set PG_PORT=5432

:: Verificar configuración de usuario
if not exist "postgres_config.txt" (
    echo ⚠️  Configuración no encontrada
    echo Creando configuración inicial...
    call :CREAR_CONFIG_INICIAL
)

:MAIN_MENU
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║           POSTGRESQL LAUNCHER                ║
echo                  ║          Universal Database Manager          ║
echo                  ║    Desarrollado con ❤️ por Jose Pablo        ║
echo                  ║           Miranda Quintanilla                ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo                        ╔════════════════════════════════╗
echo                        ║        MENÚ PRINCIPAL          ║
echo                        ╚════════════════════════════════╝
echo.
echo                         1. Iniciar Servicio PostgreSQL
echo                            - Iniciar servicio de base de datos
echo.
echo                         2. Detener Servicio PostgreSQL
echo                            - Detener servicio de base de datos
echo.
echo                         3. Estado del Servicio
echo                            - Verificar estado del servicio
echo.
echo                         4. Conectar con psql
echo                            - Terminal interactivo PostgreSQL
echo.
echo                         5. Gestionar Bases de Datos
echo                            - Crear, listar y eliminar DBs
echo.
echo                         6. Gestionar Usuarios
echo                            - Crear y administrar usuarios
echo.
echo                         7. Backup y Restauración
echo                            - Respaldar y restaurar bases de datos
echo.
echo                         8. Configuración
echo                            - Configurar conexión y credenciales
echo.
echo                         9. Información del Sistema
echo                            - Ver detalles de instalación
echo.
echo                         10. Instrucciones de Uso
echo                            - Guía de instalación y configuración
echo.
echo                         0. Salir
echo.
echo                        📊 Usuario actual: postgres
echo                        📍 Puerto: 5432
echo                        📁 Ejecutándose desde: %CD%
echo.
set /p choice=                        Selecciona una opción [0-10]: 

if "%choice%"=="0" goto SALIR
if "%choice%"=="1" goto INICIAR_SERVICIO
if "%choice%"=="2" goto DETENER_SERVICIO
if "%choice%"=="3" goto ESTADO_SERVICIO
if "%choice%"=="4" goto CONECTAR_PSQL
if "%choice%"=="5" goto GESTIONAR_DB
if "%choice%"=="6" goto GESTIONAR_USUARIOS
if "%choice%"=="7" goto BACKUP_RESTAURACION
if "%choice%"=="8" goto CONFIGURACION
if "%choice%"=="9" goto INFO_SISTEMA
if "%choice%"=="10" goto INSTRUCCIONES_USO

echo ❌ Opción inválida. Presiona cualquier tecla para continuar...
pause >nul
goto MAIN_MENU

:: ========================================
:: CONFIGURAR RUTA MANUAL
:: ========================================
:CONFIGURAR_RUTA_MANUAL
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║         CONFIGURAR RUTA POSTGRESQL           ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo ❌ PostgreSQL no se encontró automáticamente.
echo.
echo 📁 Por favor, ingresa la ruta donde está instalado PostgreSQL:
echo    Ejemplo: C:\Program Files\PostgreSQL\15
echo.
set /p manual_path=                        Ruta de instalación: 

if exist "!manual_path!\bin\psql.exe" (
    set PG_DIR=!manual_path!
    set PG_BIN=!manual_path!\bin
    set PG_DATA=!manual_path!\data
    echo ✅ PostgreSQL encontrado en: !manual_path!
    
    :: Guardar la ruta en configuración
    (
    echo # PostgreSQL Launcher - Configuración de Usuario
    echo # Ruta configurada manualmente
    echo PG_PATH=!manual_path!
    echo PG_PASSWORD=postgres
    echo PG_PORT=5432
    echo PG_USER=postgres
    echo PG_HOST=localhost
    echo CONFIG_VERSION=1.0
    ) > "postgres_config.txt"
    
    echo ✅ Configuración guardada
    timeout /t 2 /nobreak >nul
    goto MAIN_MENU
) else (
    echo ❌ No se encontró PostgreSQL en la ruta especificada
    echo Verifica la ruta e intenta nuevamente
    pause >nul
    goto CONFIGURAR_RUTA_MANUAL
)

:: ========================================
:: INICIAR SERVICIO
:: ========================================
:INICIAR_SERVICIO
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             INICIAR SERVICIO                 ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo Verificando estado del servicio PostgreSQL...
sc query !PG_SERVICE! | find "RUNNING" >nul
if not errorlevel 1 (
    echo ✅ PostgreSQL ya está en ejecución
    echo.
    echo Información del servicio:
    sc query !PG_SERVICE! | find "STATE"
) else (
    echo 🔄 Iniciando PostgreSQL...
    net start !PG_SERVICE!
    if errorlevel 1 (
        echo ❌ Error al iniciar PostgreSQL
        echo.
        echo Posibles soluciones:
        echo 1. Verificar que PostgreSQL esté instalado correctamente
        echo 2. Ejecutar como administrador
        echo 3. Revisar los logs en !PG_DATA!\postgresql.log
    ) else (
        echo ✅ PostgreSQL iniciado correctamente
        timeout /t 2 /nobreak >nul
    )
)
echo.
echo Presiona cualquier tecla para volver al menú principal...
pause >nul
goto MAIN_MENU

:: ========================================
:: DETENER SERVICIO
:: ========================================
:DETENER_SERVICIO
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             DETENER SERVICIO                 ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo Verificando estado del servicio PostgreSQL...
sc query !PG_SERVICE! | find "RUNNING" >nul
if errorlevel 1 (
    echo ℹ️  PostgreSQL no está en ejecución
) else (
    echo ⚠️  ¿Estás seguro de que deseas detener PostgreSQL?
    set /p confirmar=                        Confirmar (s/n): 
    if /i "!confirmar!"=="s" (
        echo 🔄 Deteniendo PostgreSQL...
        net stop !PG_SERVICE!
        if errorlevel 1 (
            echo ❌ Error al detener PostgreSQL
        ) else (
            echo ✅ PostgreSQL detenido correctamente
        )
    ) else (
        echo ❌ Operación cancelada
    )
)
echo.
echo Presiona cualquier tecla para volver al menú principal...
pause >nul
goto MAIN_MENU

:: ========================================
:: ESTADO DEL SERVICIO
:: ========================================
:ESTADO_SERVICIO
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             ESTADO DEL SERVICIO              ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 📊 INFORMACIÓN DEL SERVICIO:
echo ========================================
sc query !PG_SERVICE! | find "STATE"
echo.
echo 🌐 PUERTOS EN USO:
netstat -an | find ":5432" >nul && echo ✅ Puerto 5432: PostgreSQL activo || echo ❌ Puerto 5432: No activo
echo.
echo 📁 DIRECTORIO DE DATOS:
if exist "!PG_DATA!" (
    echo ✅ !PG_DATA!
) else (
    echo ❌ Directorio no encontrado
)
echo.
echo 🔍 PROCESOS ACTIVOS:
tasklist | find "postgres" >nul && echo ✅ Procesos PostgreSQL activos || echo ❌ No hay procesos PostgreSQL
echo ========================================
echo.
echo Presiona cualquier tecla para volver al menú principal...
pause >nul
goto MAIN_MENU

:: ========================================
:: CONECTAR CON PSQL
:: ========================================
:CONECTAR_PSQL
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             CONECTAR CON PSQL                ║
echo                  ╚══════════════════════════════════════════════╝
echo.
call :CARGAR_CONFIG

:CONECTAR_PSQL_MENU
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             CONECTAR CON PSQL                ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo Opciones de conexión:
echo.
echo 1. Conectar como usuario postgres
echo 2. Conectar con usuario personalizado
echo 3. Conectar a base de datos específica
echo 4. Volver al menú principal
echo.
set /p conexion_choice=                        Selecciona opción [1-4]: 

if "!conexion_choice!"=="1" (
    echo 🔄 Conectando como usuario postgres...
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT!
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto CONECTAR_PSQL_MENU
) else if "!conexion_choice!"=="2" (
    set /p custom_user=                        Ingresa nombre de usuario: 
    cd /d "!PG_BIN!"
    psql.exe -U !custom_user! -h localhost -p !PG_PORT! -d postgres
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto CONECTAR_PSQL_MENU
) else if "!conexion_choice!"=="3" (
    set /p db_name=                        Ingresa nombre de base de datos: 
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT! -d !db_name!
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto CONECTAR_PSQL_MENU
) else if "!conexion_choice!"=="4" (
    goto MAIN_MENU
) else (
    echo ❌ Opción inválida
    pause >nul
    goto CONECTAR_PSQL_MENU
)

:: ========================================
:: GESTIONAR BASES DE DATOS
:: ========================================
:GESTIONAR_DB
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║           GESTIONAR BASES DE DATOS           ║
echo                  ╚══════════════════════════════════════════════╝
echo.
call :CARGAR_CONFIG

:GESTIONAR_DB_MENU
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║           GESTIONAR BASES DE DATOS           ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 1. Listar bases de datos
echo 2. Crear nueva base de datos
echo 3. Eliminar base de datos
echo 4. Información de base de datos
echo 5. Volver al menú principal
echo.
set /p db_choice=                        Selecciona opción [1-5]: 

if "!db_choice!"=="1" (
    echo 📋 Bases de datos existentes:
    echo ========================================
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT! -c "\l"
    echo ========================================
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_DB_MENU
) else if "!db_choice!"=="2" (
    set /p new_db=                        Ingresa nombre de la nueva base de datos: 
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT! -c "CREATE DATABASE !new_db!;"
    echo ✅ Base de datos '!new_db!' creada exitosamente
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_DB_MENU
) else if "!db_choice!"=="3" (
    set /p del_db=                        Ingresa nombre de la base de datos a eliminar: 
    echo ⚠️  ¿Estás seguro de eliminar la base de datos '!del_db!'?
    set /p confirmar=                        Confirmar (s/n): 
    if /i "!confirmar!"=="s" (
        cd /d "!PG_BIN!"
        psql.exe -U postgres -h localhost -p !PG_PORT! -c "DROP DATABASE !del_db!;"
        echo ✅ Base de datos '!del_db!' eliminada
    ) else (
        echo ❌ Operación cancelada
    )
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_DB_MENU
) else if "!db_choice!"=="4" (
    set /p info_db=                        Ingresa nombre de la base de datos: 
    echo 📊 Información de la base de datos:
    echo ========================================
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT! -d !info_db! -c "\dt"
    echo ========================================
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_DB_MENU
) else if "!db_choice!"=="5" (
    goto MAIN_MENU
) else (
    echo ❌ Opción inválida
    pause >nul
    goto GESTIONAR_DB_MENU
)

:: ========================================
:: GESTIONAR USUARIOS
:: ========================================
:GESTIONAR_USUARIOS
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             GESTIONAR USUARIOS               ║
echo                  ╚══════════════════════════════════════════════╝
echo.
call :CARGAR_CONFIG

:GESTIONAR_USUARIOS_MENU
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             GESTIONAR USUARIOS               ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 1. Listar usuarios
echo 2. Crear nuevo usuario
echo 3. Cambiar contraseña de usuario
echo 4. Eliminar usuario
echo 5. Volver al menú principal
echo.
set /p user_choice=                        Selecciona opción [1-5]: 

if "!user_choice!"=="1" (
    echo 👥 Usuarios existentes:
    echo ========================================
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT! -c "\du"
    echo ========================================
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_USUARIOS_MENU
) else if "!user_choice!"=="2" (
    set /p new_user=                        Ingresa nombre del nuevo usuario: 
    set /p user_password=                        Ingresa contraseña: 
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT! -c "CREATE USER !new_user! WITH PASSWORD '!user_password!';"
    echo ✅ Usuario '!new_user!' creado exitosamente
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_USUARIOS_MENU
) else if "!user_choice!"=="3" (
    set /p user_name=                        Ingresa nombre del usuario: 
    set /p new_password=                        Ingresa nueva contraseña: 
    cd /d "!PG_BIN!"
    psql.exe -U postgres -h localhost -p !PG_PORT! -c "ALTER USER !user_name! WITH PASSWORD '!new_password!';"
    echo ✅ Contraseña actualizada para '!user_name!'
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_USUARIOS_MENU
) else if "!user_choice!"=="4" (
    set /p del_user=                        Ingresa nombre del usuario a eliminar: 
    echo ⚠️  ¿Estás seguro de eliminar el usuario '!del_user!'?
    set /p confirmar=                        Confirmar (s/n): 
    if /i "!confirmar!"=="s" (
        cd /d "!PG_BIN!"
        psql.exe -U postgres -h localhost -p !PG_PORT! -c "DROP USER !del_user!;"
        echo ✅ Usuario '!del_user!' eliminado
    ) else (
        echo ❌ Operación cancelada
    )
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto GESTIONAR_USUARIOS_MENU
) else if "!user_choice!"=="5" (
    goto MAIN_MENU
) else (
    echo ❌ Opción inválida
    pause >nul
    goto GESTIONAR_USUARIOS_MENU
)

:: ========================================
:: BACKUP Y RESTAURACIÓN
:: ========================================
:BACKUP_RESTAURACION
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║           BACKUP Y RESTAURACIÓN              ║
echo                  ╚══════════════════════════════════════════════╝
echo.
call :CARGAR_CONFIG

set BACKUP_DIR=%CD%\PostgreSQL_Backups
if not exist "!BACKUP_DIR!" mkdir "!BACKUP_DIR!"

:BACKUP_RESTAURACION_MENU
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║           BACKUP Y RESTAURACIÓN              ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 1. Crear backup de base de datos
echo 2. Restaurar backup
echo 3. Listar backups disponibles
echo 4. Volver al menú principal
echo.
set /p backup_choice=                        Selecciona opción [1-4]: 

if "!backup_choice!"=="1" (
    set /p backup_db=                        Ingresa nombre de la base de datos: 
    set backup_file=!BACKUP_DIR!\!backup_db!_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%.backup
    echo 📦 Creando backup de '!backup_db!'...
    cd /d "!PG_BIN!"
    pg_dump.exe -U postgres -h localhost -p !PG_PORT! -d !backup_db! -F c -b -v -f "!backup_file!"
    if errorlevel 1 (
        echo ❌ Error al crear backup
    ) else (
        echo ✅ Backup creado: !backup_file!
    )
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto BACKUP_RESTAURACION_MENU
) else if "!backup_choice!"=="2" (
    echo 📋 Backups disponibles:
    dir /b "!BACKUP_DIR!\*.backup" 2>nul || echo No hay backups disponibles
    echo.
    set /p restore_file=                        Ingresa nombre del archivo de backup: 
    set /p restore_db=                        Ingresa nombre de la base de datos destino: 
    echo 🔄 Restaurando backup...
    cd /d "!PG_BIN!"
    pg_restore.exe -U postgres -h localhost -p !PG_PORT! -d !restore_db! -v "!BACKUP_DIR!\!restore_file!"
    if errorlevel 1 (
        echo ❌ Error al restaurar backup
    ) else (
        echo ✅ Backup restaurado en '!restore_db!'
    )
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto BACKUP_RESTAURACION_MENU
) else if "!backup_choice!"=="3" (
    echo 📁 Backups en !BACKUP_DIR!:
    echo ========================================
    dir "!BACKUP_DIR!\*.backup" 2>nul || echo No hay backups disponibles
    echo ========================================
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto BACKUP_RESTAURACION_MENU
) else if "!backup_choice!"=="4" (
    goto MAIN_MENU
) else (
    echo ❌ Opción inválida
    pause >nul
    goto BACKUP_RESTAURACION_MENU
)

:: ========================================
:: CONFIGURACIÓN
:: ========================================
:CONFIGURACION
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║               CONFIGURACIÓN                  ║
echo                  ╚══════════════════════════════════════════════╝
echo.
call :CARGAR_CONFIG

:CONFIGURACION_MENU
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║               CONFIGURACIÓN                  ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 1. Configurar contraseña de PostgreSQL
echo 2. Configurar puerto de conexión
echo 3. Ver configuración actual
echo 4. Configurar ruta de PostgreSQL
echo 5. Restablecer configuración
echo 6. Volver al menú principal
echo.
set /p config_choice=                        Selecciona opción [1-6]: 

if "!config_choice!"=="1" (
    echo 🔐 Configurar contraseña de PostgreSQL
    echo ⚠️  Esta contraseña se usará para todas las operaciones
    set /p pg_password=                        Ingresa nueva contraseña: 
    echo Contraseña actualizada en el archivo de configuración
    call :ACTUALIZAR_CONFIG
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto CONFIGURACION_MENU
) else if "!config_choice!"=="2" (
    set /p new_port=                        Ingresa nuevo puerto (actual: !PG_PORT!): 
    echo !new_port! | findstr /r "^[0-9]*$" >nul
    if errorlevel 1 (
        echo ❌ Debes ingresar un número válido
    ) else (
        set PG_PORT=!new_port!
        echo ✅ Puerto actualizado a: !PG_PORT!
        call :ACTUALIZAR_CONFIG
    )
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto CONFIGURACION_MENU
) else if "!config_choice!"=="3" (
    echo 📄 Configuración actual:
    echo ========================================
    if exist "postgres_config.txt" (
        type "postgres_config.txt"
    ) else (
        echo Configuración predeterminada
        echo Usuario: postgres
        echo Puerto: 5432
    )
    echo ========================================
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto CONFIGURACION_MENU
) else if "!config_choice!"=="4" (
    call :CONFIGURAR_RUTA_MANUAL
    goto CONFIGURACION_MENU
) else if "!config_choice!"=="5" (
    echo ⚠️  ¿Restablecer configuración a valores predeterminados?
    set /p confirmar=                        Confirmar (s/n): 
    if /i "!confirmar!"=="s" (
        del "postgres_config.txt" 2>nul
        echo ✅ Configuración restablecida
        call :CREAR_CONFIG_INICIAL
    )
    echo.
    echo Presiona cualquier tecla para continuar...
    pause >nul
    goto CONFIGURACION_MENU
) else if "!config_choice!"=="6" (
    goto MAIN_MENU
) else (
    echo ❌ Opción inválida
    pause >nul
    goto CONFIGURACION_MENU
)

:: ========================================
:: INFORMACIÓN DEL SISTEMA
:: ========================================
:INFO_SISTEMA
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║           INFORMACIÓN DEL SISTEMA            ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 📊 POSTGRESQL:
cd /d "!PG_BIN!"
psql.exe --version 2>nul && echo ✅ PostgreSQL detectado || echo ❌ PostgreSQL no encontrado

echo.
echo 📁 INSTALACIÓN:
if exist "!PG_DIR!" (
    echo ✅ Directorio: !PG_DIR!
) else (
    echo ❌ PostgreSQL no encontrado en la ruta esperada
)

echo.
echo 🔧 SERVICIO:
sc query !PG_SERVICE! | find "RUNNING" >nul && echo ✅ Servicio activo || echo ❌ Servicio inactivo

echo.
echo 🌐 CONEXIÓN:
netstat -an | find ":5432" >nul && echo ✅ Puerto 5432 activo || echo ❌ Puerto 5432 inactivo

echo.
echo 📍 UBICACIÓN SCRIPT:
echo %CD%
echo.
echo Presiona cualquier tecla para volver al menú principal...
pause >nul
goto MAIN_MENU

:: ========================================
:: INSTRUCCIONES DE USO
:: ========================================
:INSTRUCCIONES_USO
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║             INSTRUCCIONES DE USO             ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 📋 GUÍA DE USO - SCRIPT PORTÁTIL:
echo.
echo 🎯 CARACTERÍSTICAS PRINCIPALES:
echo    ✅ Ejecutable desde CUALQUIER ubicación
echo    ✅ Detección automática de PostgreSQL
echo    ✅ Configuración manual si es necesario
echo    ✅ Totalmente portátil y universal
echo.
echo 🚀 FORMAS DE USO:
echo.
echo 1. 📁 EN ESCRITORIO:
echo    - Colocar el script en el Escritorio
echo    - Doble clic para ejecutar (como Admin)
echo    - El script detectará PostgreSQL automáticamente
echo.
echo 2. 📁 EN CARPETA PERSONAL:
echo    - Guardar en Documents, Downloads, etc.
echo    - Ejecutar desde cualquier ubicación
echo    - Los backups se guardan en la misma carpeta
echo.
echo 3. 📁 EN USB PORTÁTIL:
echo    - Llevar el script en USB
echo    - Usar en diferentes computadoras
echo    - Configurar ruta manualmente si es necesario
echo.
echo 4. 🐙 EN GITHUB:
echo    - Descargar el script .bat
echo    - Ejecutar desde cualquier ubicación
echo    - Configurar durante primer uso
echo.
echo ⚠️  CONFIGURACIÓN INICIAL:
echo    - El script busca PostgreSQL automáticamente
echo    - Si no lo encuentra, pedirá la ruta manual
echo    - Configura tu propia contraseña
echo    - ¡Listo para usar!
echo.
echo Presiona cualquier tecla para volver al menú principal...
pause >nul
goto MAIN_MENU

:: ========================================
:: FUNCIONES AUXILIARES
:: ========================================

:CREAR_CONFIG_INICIAL
(
echo # PostgreSQL Launcher - Configuración de Usuario
echo # Este archivo se genera automáticamente
echo # NO COMPARTIR este archivo contiene credenciales
echo.
echo PG_PATH=!PG_DIR!
echo PG_PASSWORD=postgres
echo PG_PORT=5432
echo PG_USER=postgres
echo PG_HOST=localhost
echo CONFIG_VERSION=1.0
) > "postgres_config.txt"
goto :eof

:CARGAR_CONFIG
if exist "postgres_config.txt" (
    for /f "tokens=1,2 delims==" %%i in (postgres_config.txt) do (
        if "%%i"=="PG_PASSWORD" set PGPASSWORD=%%j
        if "%%i"=="PG_PORT" set PG_PORT=%%j
        if "%%i"=="PG_USER" set PG_USER=%%j
        if "%%i"=="PG_HOST" set PG_HOST=%%j
        if "%%i"=="PG_PATH" (
            set PG_DIR=%%j
            set PG_BIN=%%j\bin
            set PG_DATA=%%j\data
        )
    )
)
goto :eof

:ACTUALIZAR_CONFIG
(
echo # PostgreSQL Launcher - Configuración de Usuario
echo # Actualizado el %date% %time%
echo # NO COMPARTIR este archivo contiene credenciales
echo.
echo PG_PATH=!PG_DIR!
echo PG_PASSWORD=!pg_password!
echo PG_PORT=!PG_PORT!
echo PG_USER=postgres
echo PG_HOST=localhost
echo CONFIG_VERSION=1.0
) > "postgres_config.txt"
goto :eof

:: ========================================
:: SALIR
:: ========================================
:SALIR
cls
echo.
echo                  ╔══════════════════════════════════════════════╗
echo                  ║                  ¡HASTA PRONTO!              ║
echo                  ╚══════════════════════════════════════════════╝
echo.
echo 👋 Gracias por usar PostgreSQL Launcher
echo 🐘 PostgreSQL Universal Database Manager
echo 📍 Script portátil - Ejecutable desde cualquier ubicación
echo 👨‍💻 Desarrollado por: Jose Pablo Miranda Quintanilla
echo 🌟 Código abierto - Uso universal
echo.
echo Presiona cualquier tecla para salir...
pause >nul
exit