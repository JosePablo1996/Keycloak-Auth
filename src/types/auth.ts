export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userInfo: UserInfo | null;
}

export interface UserInfo {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
}

export interface AuthResponse {
  accessToken: string;
  accessTokenExpirationDate: string;
  authorizeAdditionalParameters?: { [key: string]: string };
  idToken: string;
  refreshToken: string;
  tokenAdditionalParameters?: { [key: string]: string };
  scopes: string[];
}

export interface KeycloakConfig {
  issuer: string;
  clientId: string;
  redirectUrl: string;
  scopes: string[];
  clientSecret: string;
  serviceConfiguration?: {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    revocationEndpoint: string;
  };
}