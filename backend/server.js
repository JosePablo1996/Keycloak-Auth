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
  KEYCLOAK_CLIENT_SECRET,
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
        ...(KEYCLOAK_CLIENT_SECRET && { client_secret: KEYCLOAK_CLIENT_SECRET })
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
    
    // Verificar configuración del realm
    const realmResponse = await axios.get(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    // Verificar client scopes
    const scopesResponse = await axios.get(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/client-scopes`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const addressScope = scopesResponse.data.find(scope => scope.name === 'address');
    
    res.json({
      success: true,
      message: 'Conexión exitosa con Keycloak',
      keycloak: 'Conectado',
      realm: KEYCLOAK_REALM,
      canAuthenticate: true,
      tokenLength: token.length,
      addressScope: addressScope ? 'Configurado' : 'No encontrado',
      realmName: realmResponse.data.displayName
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

// Endpoint para registrar usuario - MEJORADO
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, phone, fullName, address, password } = req.body;

    console.log('\n📝 Recibiendo solicitud de registro:');
    console.log('   Usuario:', username);
    console.log('   Email:', email);
    console.log('   Teléfono:', phone);
    console.log('   Dirección:', address);
    console.log('   Nombre completo:', fullName);

    // Validar campos requeridos
    const requiredFields = { username, email, fullName, address, password };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos marcados con * son obligatorios',
        missingFields: missingFields
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
        address: address || '',
      },
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
      groups: [],
      requiredActions: ['VERIFY_EMAIL'] // Opcional: requerir verificación de email
    };

    console.log('🔐 Creando usuario en Keycloak...');
    console.log('   Datos del usuario:', JSON.stringify(userData, null, 2));
    
    const createResponse = await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
      userData,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Obtener el ID del usuario creado
    const userId = createResponse.headers.location?.split('/').pop();
    console.log('✅ Usuario creado exitosamente! ID:', userId);

    // Opcional: Asignar roles por defecto
    try {
      const defaultRole = await axios.get(
        `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/clients/${KEYCLOAK_CLIENT_ID}/roles/default-roles-${KEYCLOAK_REALM}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        }
      );

      if (defaultRole.data) {
        await axios.post(
          `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}/role-mappings/clients/${KEYCLOAK_CLIENT_ID}`,
          [defaultRole.data],
          {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('👤 Rol por defecto asignado al usuario');
      }
    } catch (roleError) {
      console.log('⚠️ No se pudo asignar rol por defecto:', roleError.message);
    }
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: userId,
      userData: {
        username,
        email,
        fullName,
        phone,
        address
      }
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
      res.status(409).json({ 
        success: false, 
        message: 'El usuario o email ya existe',
        details: 'Por favor utiliza un nombre de usuario o email diferente'
      });
    } else if (status === 403) {
      res.status(403).json({ 
        success: false, 
        message: 'Sin permisos para crear usuarios',
        details: 'Verifica los permisos del cliente de administración'
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: message,
        details: 'Error interno del servidor. Verifica la configuración de Keycloak.'
      });
    }
  }
});

// Nuevo endpoint para obtener información de usuario (útil para debugging)
app.get('/api/user-info/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const adminToken = await getAdminToken();

    const userResponse = await axios.get(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      }
    );

    res.json({
      success: true,
      user: userResponse.data
    });

  } catch (error) {
    console.error('Error obteniendo información del usuario:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo información del usuario',
      error: error.message
    });
  }
});

// Health check mejorado
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión con Keycloak
    await axios.get(`${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/.well-known/openid-configuration`);
    
    res.json({ 
      status: 'OK', 
      message: 'Backend funcionando correctamente',
      keycloak: 'Conectado',
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Problema de conexión con Keycloak',
      keycloak: 'Desconectado',
      timestamp: new Date().toISOString()
    });
  }
});

// Nuevo endpoint para verificar configuración
app.get('/api/config', (req, res) => {
  res.json({
    hasAddressField: true,
    version: '2.0.0',
    features: [
      'user-registration', 
      'address-field', 
      'keycloak-integration',
      'role-assignment',
      'health-monitoring'
    ],
    requiredScopes: ['openid', 'profile', 'email', 'address', 'phone'],
    supportedAttributes: ['phone', 'address']
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    availableEndpoints: [
      'GET  /api/health',
      'GET  /api/diagnostic',
      'GET  /api/config',
      'POST /api/register',
      'GET  /api/user-info/:userId'
    ]
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
  console.log('   GET  /api/health          - Health check mejorado');
  console.log('   GET  /api/diagnostic      - Diagnóstico completo Keycloak');
  console.log('   GET  /api/config          - Configuración del backend');
  console.log('   POST /api/register        - Registrar usuario (con dirección)');
  console.log('   GET  /api/user-info/:id   - Obtener info de usuario');
  console.log('   =================================\n');
  console.log('✅ Campo "address" completamente habilitado');
  console.log('🔍 Para probar el diagnóstico:');
  console.log(`   curl http://localhost:${BACKEND_PORT}/api/diagnostic`);
  console.log('   =================================\n');
});