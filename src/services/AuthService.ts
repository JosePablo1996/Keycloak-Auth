import { authorize, refresh, revoke } from 'react-native-app-auth';
import { Platform } from 'react-native';

class AuthService {
  private config = {
    issuer: 'https://keycloak.software-creation.es/realms/master',
    clientId: 'software-creation',
    redirectUrl: Platform.OS === 'ios' 
      ? 'com.softwarecreation.auth://oauth' 
      : 'com.softwarecreation.auth://oauth',
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    serviceConfiguration: {
      authorizationEndpoint: 'https://keycloak.software-creation.es/realms/master/protocol/openid-connect/auth',
      tokenEndpoint: 'https://keycloak.software-creation.es/realms/master/protocol/openid-connect/token',
      revocationEndpoint: 'https://keycloak.software-creation.es/realms/master/protocol/openid-connect/revoke'
    }
  };

  // ⭐ MEJORADO: Método para login con usuario y password
  async loginWithCredentials(username: string, password: string): Promise<any> {
    try {
      console.log('🔐 Iniciando autenticación con credenciales...', { 
        username, 
        clientId: this.config.clientId,
        endpoint: 'https://keycloak.software-creation.es/realms/master/protocol/openid-connect/token'
      });

      // ⭐ VALIDACIÓN: Asegurar que las credenciales son válidas
      if (!username || !password) {
        throw new Error('Usuario y contraseña son requeridos');
      }

      const requestBody = new URLSearchParams({
        client_id: this.config.clientId,
        grant_type: 'password',
        username: username.trim(),
        password: password,
        scope: 'openid profile email'
      }).toString();

      console.log('📤 Enviando solicitud de autenticación...');

      const response = await fetch(
        'https://keycloak.software-creation.es/realms/master/protocol/openid-connect/token', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: requestBody
        }
      );

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      // ⭐ MEJORADO: Manejo detallado de errores HTTP
      if (!response.ok) {
        let errorMessage = 'Error de autenticación';
        
        try {
          const errorData = await response.json();
          console.error('❌ Error detallado de Keycloak:', errorData);
          
          if (errorData.error === 'invalid_grant') {
            errorMessage = 'Credenciales inválidas. Verifica usuario y contraseña.';
          } else if (errorData.error_description) {
            errorMessage = errorData.error_description;
          } else if (errorData.error) {
            errorMessage = `Error: ${errorData.error}`;
          }
        } catch (parseError) {
          // Si no se puede parsear como JSON, usar texto plano
          const errorText = await response.text();
          console.error('❌ Error en texto plano:', errorText);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      // ⭐ PROCESAR RESPUESTA EXITOSA
      const data = await response.json();
      console.log('✅ Autenticación exitosa - Tokens recibidos:', {
        hasAccessToken: !!data.access_token,
        hasIdToken: !!data.id_token,
        hasRefreshToken: !!data.refresh_token,
        expiresIn: data.expires_in
      });

      // ⭐ VALIDAR QUE TENEMOS LOS TOKENS NECESARIOS
      if (!data.access_token) {
        throw new Error('No se recibió access token en la respuesta');
      }

      const result = {
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token,
        accessTokenExpirationDate: new Date(Date.now() + (data.expires_in * 1000)).toISOString(),
        tokenType: data.token_type,
        scope: data.scope
      };

      console.log('🎉 Login completado exitosamente');
      return result;
      
    } catch (error: any) {
      console.error('❌ Error en loginWithCredentials:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // ⭐ MEJORADO: Re-lanzar error con más contexto
      if (error.message.includes('Network request failed')) {
        throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
      } else if (error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor de autenticación.');
      } else {
        // Mantener el mensaje de error original
        throw error;
      }
    }
  }

  // ⭐ ACTUALIZADO: Método original para compatibilidad (pero ya no se usa)
  async login(): Promise<any> {
    try {
      console.log('🚀 Iniciando flujo OAuth...');
      const result = await authorize(this.config);
      console.log('✅ Login exitoso via OAuth');
      return result;
    } catch (error) {
      console.error('❌ Error en login OAuth:', error);
      throw error;
    }
  }

  async logout(accessToken: string): Promise<void> {
    try {
      console.log('🚪 Cerrando sesión...', { hasToken: !!accessToken });
      
      if (!accessToken) {
        console.log('ℹ️  No hay token para revocar');
        return;
      }

      await revoke(this.config, {
        tokenToRevoke: accessToken,
        includeBasicAuth: true
      });
      
      console.log('✅ Logout exitoso - Token revocado');
    } catch (error: any) {
      console.error('❌ Error en logout:', {
        message: error.message,
        code: error.code
      });
      
      // ⭐ MEJORADO: No lanzar error en logout para mejor UX
      console.log('⚠️  Logout completado localmente (error ignorado)');
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      console.log('🔄 Refrescando token...');
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const result = await refresh(this.config, {
        refreshToken: refreshToken
      });
      
      console.log('✅ Token refrescado exitosamente');
      return result;
    } catch (error: any) {
      console.error('❌ Error refrescando token:', error);
      throw new Error('No se pudo refrescar la sesión. Por favor inicia sesión nuevamente.');
    }
  }

  // ⭐ NUEVO: Método para verificar la configuración
  verifyConfig() {
    console.log('🔧 Configuración de AuthService:', {
      issuer: this.config.issuer,
      clientId: this.config.clientId,
      redirectUrl: this.config.redirectUrl,
      hasTokenEndpoint: !!this.config.serviceConfiguration.tokenEndpoint
    });
    
    return {
      issuer: this.config.issuer,
      clientId: this.config.clientId,
      tokenEndpoint: this.config.serviceConfiguration.tokenEndpoint
    };
  }
}

export const authService = new AuthService();