import { KeycloakConfig } from '../types/auth';

export const keycloakConfig: KeycloakConfig = {
  issuer: 'http://localhost:8080/realms/test-realm',
  clientId: 'react-client',
  redirectUrl: 'com.reactapp:/oauthredirect',
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  clientSecret: 'SdVSDDybGSpDKSzJo0Kn6qUdAQpaGrkv',
  // ⭐ REMOVIDA: dangerouslyAllowInsecureHttpRequests - Se manejará de otra forma
  serviceConfiguration: {
    authorizationEndpoint: 'http://localhost:8080/realms/test-realm/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8080/realms/test-realm/protocol/openid-connect/token',
    revocationEndpoint: 'http://localhost:8080/realms/test-realm/protocol/openid-connect/revoke'
  }
};