import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';

// Interfaces ACTUALIZADAS - Incluye phone
interface UserInfo {
  sub?: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  email_verified?: boolean;
  family_name?: string;
  name?: string;
  phone?: string; // ✅ NUEVO CAMPO AGREGADO
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
}

interface AuthResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

interface AuthContextValue {
  authState: AuthState;
  user: UserInfo | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// ✅ CONFIGURACIÓN CORREGIDA - Cliente Confidencial
const KEYCLOAK_CONFIG = {
  baseUrl: 'http://localhost:8080',
  realm: 'test-realm', 
  clientId: 'react-client', // ✅ Cliente correcto
  clientSecret: '5TNS3QssvRo6Xu7IVH9gadDhnGGt80bo'
};

// Función helper para fetch con timeout
const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userInfo: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para verificar conectividad con el servidor
  const checkServerConnectivity = async (): Promise<boolean> => {
    try {
      const testUrl = `${KEYCLOAK_CONFIG.baseUrl}/realms/${KEYCLOAK_CONFIG.realm}/.well-known/openid-configuration`;
      console.log('🔍 Verificando conectividad con:', testUrl);
      
      const response = await fetchWithTimeout(testUrl, { 
        method: 'GET'
      }, 10000);
      
      if (response.ok) {
        const config = await response.json();
        console.log('✅ Keycloak está accesible');
        console.log('📍 Token endpoint:', config.token_endpoint);
        return true;
      }
      console.log('❌ Keycloak respondió con error:', response.status);
      return false;
    } catch (error) {
      console.error('❌ Keycloak no está accesible:', error);
      return false;
    }
  };

  // Función para extraer información del usuario del token - ACTUALIZADA
  const extractUserInfo = (idToken: string): UserInfo | null => {
    try {
      if (!idToken) {
        console.warn('⚠️ No se encontró idToken');
        return null;
      }

      const payload = idToken.split('.')[1];
      if (!payload) {
        console.error('❌ Token JWT malformado');
        return null;
      }

      let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }

      const decodedPayload = JSON.parse(atob(base64));

      const userInfo: UserInfo = {
        sub: decodedPayload.sub || '',
        preferred_username: decodedPayload.preferred_username || 'usuario',
        email: decodedPayload.email || '',
        given_name: decodedPayload.given_name || '',
        family_name: decodedPayload.family_name || '',
        name: decodedPayload.name || 'Usuario',
        email_verified: decodedPayload.email_verified || false,
        phone: decodedPayload.phone || '' // ✅ NUEVO CAMPO AGREGADO
      };

      console.log('👤 UserInfo extraído del token:', {
        username: userInfo.preferred_username,
        email: userInfo.email,
        name: userInfo.name,
        phone: userInfo.phone || 'No disponible' // ✅ LOG DEL TELÉFONO
      });
      return userInfo;

    } catch (err) {
      console.error('❌ Error decodificando user info:', err);
      return null;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const login = async (username: string, password: string): Promise<void> => {
    if (!username || !password) {
      Alert.alert('❌ Error', 'Usuario y contraseña son requeridos');
      return;
    }

    const userStr = username.trim();
    const passStr = password.trim();

    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Iniciando autenticación con Keycloak...');
      console.log('📋 Configuración:', {
        username: userStr,
        clientId: KEYCLOAK_CONFIG.clientId,
        realm: KEYCLOAK_CONFIG.realm,
        baseUrl: KEYCLOAK_CONFIG.baseUrl
      });

      // ✅ ENDPOINT para token
      const tokenUrl = `${KEYCLOAK_CONFIG.baseUrl}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/token`;
      console.log('🌐 Token endpoint:', tokenUrl);

      // Verificar conectividad primero
      console.log('🔄 Verificando conectividad...');
      const isServerReachable = await checkServerConnectivity();
      if (!isServerReachable) {
        throw new Error(
          `No se puede conectar a Keycloak.\n\n` +
          `Verifica que:\n` +
          `• Keycloak esté corriendo en: ${KEYCLOAK_CONFIG.baseUrl}\n` +
          `• El realm '${KEYCLOAK_CONFIG.realm}' exista\n` +
          `• No haya firewall bloqueando el puerto 8080`
        );
      }

      // ✅ CONFIGURAR PARÁMETROS CON CLIENT_SECRET - SCOPE ACTUALIZADO
      const bodyParams = new URLSearchParams({
        grant_type: 'password',
        client_id: KEYCLOAK_CONFIG.clientId,
        client_secret: KEYCLOAK_CONFIG.clientSecret,
        username: userStr,
        password: passStr,
        scope: 'openid profile email phone' // ✅ SCOPE ACTUALIZADO CON PHONE
      });

      console.log('📤 Enviando credenciales al servidor...');
      console.log('🎯 Scope solicitado:', 'openid profile email phone');

      const response = await fetchWithTimeout(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString()
      }, 15000);

      console.log('📡 Status de respuesta:', response.status);

      // Manejar errores de respuesta
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error HTTP:', response.status, errorText);
        
        let errorMessage = 'Error de autenticación';
        
        try {
          const errorData = JSON.parse(errorText);
          console.log('🔍 Detalles del error:', errorData);
          
          // Interpretar errores específicos de Keycloak
          if (errorData.error === 'invalid_client') {
            errorMessage = 
              `❌ Error de configuración del cliente\n\n` +
              `Posibles causas:\n` +
              `• El client_secret es incorrecto\n` +
              `• El cliente '${KEYCLOAK_CONFIG.clientId}' no existe\n` +
              `• El cliente no está habilitado\n\n` +
              `Solución:\n` +
              `1. Ve a Keycloak Admin Console\n` +
              `2. Clients → ${KEYCLOAK_CONFIG.clientId}\n` +
              `3. Verifica la configuración`;
          } else if (errorData.error === 'invalid_grant') {
            errorMessage = '❌ Usuario o contraseña incorrectos';
          } else if (errorData.error === 'unauthorized_client') {
            errorMessage = 
              `❌ Cliente no autorizado\n\n` +
              `El cliente no tiene habilitado 'Direct Access Grants'.\n\n` +
              `Solución en Keycloak:\n` +
              `1. Clients → ${KEYCLOAK_CONFIG.clientId}\n` +
              `2. Settings → Direct Access Grants Enabled = ON\n` +
              `3. Guardar cambios`;
          } else {
            errorMessage = errorData.error_description || errorData.error || `Error ${response.status}`;
          }
        } catch (parseError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Parsear respuesta exitosa
      const authData: AuthResponse = await response.json();
      
      if (!authData.access_token) {
        throw new Error('No se recibió token de acceso del servidor');
      }

      console.log('✅ Tokens recibidos correctamente');
      console.log('🔑 Token type:', authData.token_type);
      console.log('⏱️ Expires in:', authData.expires_in, 'segundos');
      console.log('📋 Scope recibido:', authData.scope);

      // Extraer información del usuario del ID token
      const userInfo = extractUserInfo(authData.id_token);

      if (!userInfo) {
        console.warn('⚠️ No se pudo extraer información del usuario');
      }

      // ✅ ACTUALIZACIÓN CRÍTICA: Actualizar estado de autenticación
      const newAuthState = {
        isAuthenticated: true, // ✅ ESTO DEBE SER TRUE
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token || null,
        userInfo
      };

      console.log('🎉 Login exitoso para:', userInfo?.preferred_username || username);
      console.log('🔐 Estado de autenticación actualizado:', {
        isAuthenticated: newAuthState.isAuthenticated,
        hasToken: !!newAuthState.accessToken,
        user: newAuthState.userInfo?.preferred_username,
        phone: newAuthState.userInfo?.phone || 'No disponible' // ✅ LOG DEL TELÉFONO
      });

      // ✅ ACTUALIZAR EL ESTADO DE FORMA SÍNCRONA
      setAuthState(newAuthState);

      // ✅ MOSTRAR ALERTA DESPUÉS de actualizar el estado
      setTimeout(() => {
        Alert.alert(
          '✅ Inicio de Sesión Exitoso', 
          `Bienvenido ${userInfo?.name || userInfo?.preferred_username || username}`
        );
      }, 100);
      
    } catch (err: any) {
      console.error('❌ Error en proceso de login:', err);
      
      let errorMessage = err.message || 'Error desconocido de autenticación';
      
      // Detectar errores de red
      if (errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('Network request failed') ||
          errorMessage.includes('aborted')) {
        errorMessage = 
          `❌ Error de conexión\n\n` +
          `No se pudo conectar a Keycloak.\n\n` +
          `Verifica:\n` +
          `• Keycloak está corriendo en ${KEYCLOAK_CONFIG.baseUrl}\n` +
          `• Puedes acceder a la URL desde tu navegador`;
      }
      
      setError(errorMessage);
      Alert.alert('❌ Error de Autenticación', errorMessage);
      
      // ✅ Asegurarse de que el estado de autenticación sea false en caso de error
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        userInfo: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log('🚪 Cerrando sesión...');

      const username = authState.userInfo?.preferred_username || 'Usuario';
      
      // Opcional: Llamar al endpoint de logout de Keycloak
      if (authState.refreshToken) {
        try {
          const logoutUrl = `${KEYCLOAK_CONFIG.baseUrl}/realms/${KEYCLOAK_CONFIG.realm}/protocol/openid-connect/logout`;
          
          const bodyParams = new URLSearchParams({
            client_id: KEYCLOAK_CONFIG.clientId,
            client_secret: KEYCLOAK_CONFIG.clientSecret,
            refresh_token: authState.refreshToken
          });

          await fetchWithTimeout(logoutUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: bodyParams.toString()
          }, 10000);
          
          console.log('✅ Sesión cerrada en Keycloak');
        } catch (logoutError) {
          console.warn('⚠️ Error al cerrar sesión en Keycloak:', logoutError);
          // Continuar con el cierre local de todos modos
        }
      }
      
      // ✅ Limpiar estado local - Asegurar que isAuthenticated sea false
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        userInfo: null
      });
      setError(null);
      
      console.log('✅ Sesión cerrada localmente');
      Alert.alert('👋 Sesión Cerrada', `Hasta pronto, ${username}`);
      
    } catch (err: any) {
      console.error('❌ Error en logout:', err);
      
      // ✅ Limpiar de todos modos - Asegurar que isAuthenticated sea false
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        userInfo: null
      });
      
      Alert.alert('⚠️ Aviso', 'Sesión cerrada localmente');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Efecto mejorado para debug de autenticación
  useEffect(() => {
    console.log('🔄 Estado de autenticación actualizado:', {
      isAuthenticated: authState.isAuthenticated,
      user: authState.userInfo?.preferred_username || 'No user',
      hasToken: !!authState.accessToken,
      phone: authState.userInfo?.phone || 'No disponible' // ✅ LOG DEL TELÉFONO
    });

    if (authState.isAuthenticated && authState.userInfo) {
      console.log('🔐 USUARIO AUTENTICADO CORRECTAMENTE:', {
        username: authState.userInfo.preferred_username,
        email: authState.userInfo.email,
        phone: authState.userInfo.phone || 'No disponible', // ✅ LOG DEL TELÉFONO
        hasToken: !!authState.accessToken
      });
    }
  }, [authState.isAuthenticated, authState.userInfo, authState.accessToken]);

  // Auto-limpiar errores después de 8 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const providerValue: AuthContextValue = {
    authState,
    user: authState.userInfo,
    login,
    logout,
    isLoading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};