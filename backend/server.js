require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración desde variables de entorno
const {
  KEYCLOAK_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_ADMIN_USERNAME,
  KEYCLOAK_ADMIN_PASSWORD,
  KEYCLOAK_CLIENT_ID,
  BACKEND_PORT
} = process.env;

// Verificar que todas las variables estén configuradas
console.log('🔧 Configuración cargada:');
console.log('   Keycloak URL:', KEYCLOAK_URL);
console.log('   Realm:', KEYCLOAK_REALM);
console.log('   Admin Username:', KEYCLOAK_ADMIN_USERNAME);
console.log('   Client ID:', KEYCLOAK_CLIENT_ID);
console.log('   Puerto:', BACKEND_PORT);

// Función para obtener token de administrador
async function getAdminToken() {
  try {
    console.log('\n🔑 Intentando obtener token de Keycloak...');
    console.log('   URL:', `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`);
    
    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      new URLSearchParams({
        username: KEYCLOAK_ADMIN_USERNAME,
        password: KEYCLOAK_ADMIN_PASSWORD,
        grant_type: 'password',
        client_id: KEYCLOAK_CLIENT_ID,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      }
    );
    
    console.log('✅ Token obtenido exitosamente!');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error obteniendo token de Keycloak:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   No se puede conectar a Keycloak. ¿Está corriendo en', KEYCLOAK_URL, '?');
    } else if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
    
    throw error;
  }
}

// Endpoint de diagnóstico mejorado
app.get('/api/diagnostic', async (req, res) => {
  try {
    console.log('\n🩺 Ejecutando diagnóstico...');
    const token = await getAdminToken();
    
    res.json({
      success: true,
      message: 'Conexión exitosa con Keycloak',
      keycloak: 'Conectado',
      realm: KEYCLOAK_REALM,
      canAuthenticate: true,
      tokenLength: token.length
    });
  } catch (error) {
    console.error('❌ Diagnóstico fallido:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error de conexión con Keycloak',
      keycloak: 'Desconectado',
      error: error.message,
      suggestion: 'Verifica que Keycloak esté corriendo y las credenciales sean correctas'
    });
  }
});

// Endpoint para registrar usuario - ACTUALIZADO CON CAMPO ADDRESS
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, phone, fullName, address, password } = req.body;

    console.log('\n📝 Recibiendo solicitud de registro:');
    console.log('   Usuario:', username);
    console.log('   Email:', email);
    console.log('   Dirección:', address); // NUEVO LOG

    // Validar campos requeridos
    if (!username || !email || !fullName || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos marcados con * son obligatorios'
      });
    }

    const adminToken = await getAdminToken();

    const nameParts = fullName.split(' ');
    const userData = {
      username,
      email,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      enabled: true,
      emailVerified: false,
      attributes: {
        phone: phone || '',
        address: address || '', // NUEVO CAMPO AGREGADO
      },
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    };

    console.log('🔐 Creando usuario en Keycloak...');
    console.log('   Datos del usuario:', JSON.stringify(userData, null, 2));
    
    const response = await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
      userData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Usuario creado exitosamente!');
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: response.headers.location?.split('/').pop(),
    });

  } catch (error) {
    console.error('❌ Error en registro:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }

    const status = error.response?.status;
    const message = error.response?.data?.errorMessage || 'Error del servidor';

    if (status === 401) {
      res.status(401).json({ success: false, message: 'Credenciales de administrador inválidas' });
    } else if (status === 409) {
      res.status(409).json({ success: false, message: 'El usuario o email ya existe' });
    } else if (status === 403) {
      res.status(403).json({ success: false, message: 'Sin permisos para crear usuarios' });
    } else {
      res.status(500).json({ 
        success: false, 
        message: message,
        details: 'Verifica que el campo address esté configurado en Keycloak'
      });
    }
  }
});

// Health check básico
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando',
    timestamp: new Date().toISOString()
  });
});

// Nuevo endpoint para verificar configuración
app.get('/api/config', (req, res) => {
  res.json({
    hasAddressField: true,
    version: '1.1.0',
    features: ['user-registration', 'address-field', 'keycloak-integration']
  });
});

app.listen(BACKEND_PORT, () => {
  console.log('\n🚀 =================================');
  console.log('   Backend Keycloak INICIADO');
  console.log('   =================================');
  console.log(`   📍 Puerto: ${BACKEND_PORT}`);
  console.log(`   🔗 URL: http://localhost:${BACKEND_PORT}`);
  console.log('   =================================\n');
  console.log('📋 Endpoints disponibles:');
  console.log('   GET  /api/health     - Health check básico');
  console.log('   GET  /api/diagnostic - Diagnóstico Keycloak');
  console.log('   GET  /api/config     - Configuración del backend');
  console.log('   POST /api/register   - Registrar usuario (con dirección)');
  console.log('   =================================\n');
  console.log('✅ Campo "address" habilitado en el registro');
});