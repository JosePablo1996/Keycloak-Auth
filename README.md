📋 Descripción General

Sistema completo de autenticación Single Sign-On (SSO) basado en Keycloak para la Universidad Francisco Gavidia, que incluye backend API, frontend React Native y servidor Keycloak configurado.

🏗️ Arquitectura del Sistema

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend API   │    │   Keycloak      │
│  React Native   │◄──►│   Node.js/Express│◄──►│   Auth Server   │
│   (Expo)        │    │   (Puerto 3001)  │    │  (Puerto 8080)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   PostgreSQL     │
                       │   Database       │
                       └──────────────────┘

⚙️ Requisitos del Sistema

Software Requerido

-Windows 10/11 (Sistema operativo compatible)

-Node.js 16+ (JavaScript runtime)

-Java 11+ (Para Keycloak)

-PostgreSQL 15 (Base de datos)

-Keycloak 26.4.1 (Servidor de autenticación)

Permisos Requeridos

✅ Ejecución como Administrador

✅ Acceso a puertos de red (3001, 8080, 19006)

✅ Permisos de gestión de servicios

🚀 Instalación y Configuración

Paso 1: Preparación del Entorno

- 1.1 Instalar Node.js
Descargar desde nodejs.org

- Instalar versión LTS (16.x o superior)

- Verificar instalación:
node --version
npm --version

1.2 Instalar PostgreSQL

-Descargar PostgreSQL 15 desde postgresql.org

-Durante la instalación, configurar:

-Puerto: 5432

-Password: postgres123

-Crear base de datos para Keycloak:

CREATE DATABASE keycloakdb;
CREATE USER keycloakuser WITH PASSWORD 'keycloak123';
GRANT ALL PRIVILEGES ON DATABASE keycloakdb TO keycloakuser;

1.3 Instalar Java

- Descargar Java 11+ desde oracle.com

- Configurar variables de entorno JAVA_HOME

- Verificar instalación:

java -version

Paso 2: Configuración de Keycloak
2.1 Descargar e Instalar Keycloak
Descargar Keycloak 26.4.1 desde keycloak.org

Extraer en C:\keycloak-26.4.1\

Copiar keycloak-launcher.bat en C:\keycloak-26.4.1\bin\

2.2 Configuración Inicial de Keycloak
Ejecutar keycloak-launcher.bat como Administrador

Seleccionar opción 1. Modo Desarrollo (8080)

El sistema automáticamente:

✅ Inicia PostgreSQL

✅ Configura Keycloak

✅ Inicia servidor en puerto 8080

2.3 Configurar Realm y Usuarios
Acceder a: http://localhost:8080/admin

Credenciales predeterminadas:

Usuario: admin

Contraseña: admin123

Crear Realm "test-realm":

En consola admin: Add Realm → "test-realm"

Crear usuario de prueba:

Username: jmtranda

Password: clave123 (Temporal: OFF)

Paso 3: Configuración del Backend
3.1 Estructura de Directorios

C:\proyectos_react_native\KeycloakSSOApp\
├── backend\           # API Server
├── frontend\          # React Native App
└── scripts\          # Utilidades

3.2 Configuración Backend
Ejecutar start-services.bat como Administrador

Seleccionar 1. 🚀 Inicio Rápido

El script automáticamente:

✅ Verifica dependencias

✅ Crea archivo .env

✅ Instala dependencias npm

✅ Inicia servidor en puerto 3001

3.3 Variables de Entorno (Auto-generadas)

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=ufg-realm
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin123
KEYCLOAK_CLIENT_ID=ufg-client
BACKEND_PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/ufg_sso
JWT_SECRET=ufg-sso-secret-key-2024

Paso 4: Frontend React Native
4.1 Instalación de Dependencias

cd C:\proyectos_react_native\KeycloakSSOApp\frontend
npm install

4.2 Iniciar Desarrollador

npm run web
# o usando el script unificado
# Desde start-services.bat se monitorea en puerto 19006

🎯 Uso del Sistema
Inicio Rápido con Scripts
Opción 1: Script Unificado (Recomendado)

# Ejecutar como Administrador
start-services.bat

Flujo recomendado:

🚀 Inicio Rápido - Verificación completa del sistema

🔥 Iniciar Backend - Servidor API en puerto 3001

📊 Panel de Estado - Monitoreo de servicios

🌐 Iniciar Frontend - Aplicación React Native

Opción 2: Scripts Individuales
Para Keycloak:

keycloak-launcher.bat
# Seleccionar: 1. Modo Desarrollo (8080)

Para Backend:

start-services.bat
# Seleccionar: 2. Iniciar Backend

URLs del Sistema
Servicio	URL	Puerto	Estado
🔵 Backend API	http://localhost:3001/api/health	3001	✅ Salud del sistema
🟠 Keycloak Admin	http://localhost:8080/admin	8080	🔐 Administración
🟣 Frontend App	http://localhost:19006	19006	📱 Aplicación
🗄️ PostgreSQL	localhost:5432	5432	💾 Base de datos


🔧 Gestión y Monitoreo
Comandos de Verificación
Estado de servicios:

# Desde start-services.bat
Opción 3. 📊 Panel de Estado

Monitoreo en tiempo real:

# Desde start-services.bat  
Opción 4. 🔄 Monitor en Tiempo Real

Utilidades del sistema:

# Desde start-services.bat
Opción 5. 🛠️ Utilidades del Sistema

# Desde start-services.bat
Opción 5. 🛠️ Utilidades del Sistema

start-services.bat → Opción 1. 🚀 Inicio Rápido

Detener servicios:

start-services.bat → Opción 6. 🛑 Detener Todos los Servicios

Reiniciar backend:

# El sistema tiene reinicio automático
# O manualmente desde el menú principal

🐛 Solución de Problemas
Problemas Comunes
❌ "Permisos de administrador insuficientes"
Solución:

Ejecutar scripts con clic derecho → Ejecutar como administrador

Verificar UAC (Control de Cuentas de Usuario)

❌ "Puerto ya en uso"
Solución:

# Usar utilidad de verificación de puertos
start-services.bat → Opción 5 → Opción 4
# O detener servicios conflictivos
taskkill /f /im node.exe

❌ "Node.js no encontrado"
Solución:

Reinstalar Node.js

Verificar variable de entorno PATH

Reiniciar terminal después de instalación

❌ "Keycloak no inicia"
Solución:

Verificar Java instalado: java -version

Verificar PostgreSQL ejecutándose

Revisar logs en C:\keycloak-26.4.1\bin\

Comandos de Diagnóstico
Verificar servicios ejecutándose:

tasklist /fi "imagename eq node.exe"
netstat -an | findstr "3001\|8080\|19006"

Verificar conexión a APIs:

# Backend
Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -UseBasicParsing

# Keycloak  
Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing

Verificar conexión a APIs:

# Backend
Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -UseBasicParsing

# Keycloak  
Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing

📁 Estructura de Archivos
Scripts Principales
start-services.bat - Gestión unificada del sistema completo

keycloak-launcher.bat - Administración específica de Keycloak

Directorios Clave
C:\keycloak-26.4.1\ - Servidor Keycloak

C:\proyectos_react_native\KeycloakSSOApp\backend\ - API Server

C:\Program Files\PostgreSQL\15\ - Base de datos

C:\proyectos_react_native\KeycloakSSOApp\frontend\ - Aplicación React Native

🔐 Credenciales por Defecto
Keycloak Admin
URL: http://localhost:8080/admin

Usuario: admin

Contraseña: admin123

Base de Datos
Host: localhost:5432

Database: keycloakdb

Usuario: keycloakuser

Contraseña: keycloak123

Usuario de Prueba
Realm: test-realm

Usuario: jmtranda

Contraseña: clave123

📞 Soporte y Contacto
Recursos de Ayuda
Centro de Ayuda: En start-services.bat → Opción 7

Información del Sistema: En start-services.bat → Opción 8

Instrucciones Keycloak: En keycloak-launcher.bat → Opción 9

Contacto del Desarrollador
👨‍💻 José Pablo Miranda Quintanilla

📧 jmirandaquintanilla@gmail.com

🏫 Universidad Francisco Gavidia

Registro de Cambios
Ver historial completo en: keycloak-launcher.bat → Opción 10

✅ Verificación Final
Después de la instalación, verificar que todos los servicios estén activos:

✅ PostgreSQL ejecutándose en puerto 5432

✅ Keycloak accesible en http://localhost:8080

✅ Backend API respondiendo en http://localhost:3001/api/health

✅ Frontend disponible en http://localhost:19006

✅ Permisos de administrador confirmados

El sistema está listo para desarrollo y pruebas de la solución SSO KEYCLOAK AUTH de la UFG.

🔐 SSO KEYCLOAK AUTH v4.0.0
🏫 Universidad Francisco Gavidia
👨‍💻 Desarrollado por José Pablo Miranda Quintanilla