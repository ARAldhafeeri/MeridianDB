/**
 * Authentication & authorization service interface.
 * Responsibilities:
 * - Validate JWT tokens
 * - Enforce fine-grained memory permissions
 * - Context-aware gates used by controllers
 */

export interface IAuthService {
  /**
   * Admin login - opensource version have env vars
   * which is email, password upon which admin credentials are created
   * as well admin parent org is created
   */
  login(eamil: string, password: string): Promise<{ token: string | null }>;

  /**
   * Send short lived refresh token using access token
   * return the short-lived refresh token or null if the access token invalid
   * @param accessToken :
   */
  verifyAgentAccessToken(accessToken: string): Promise<string | null>;

  /**
   * Refresh the short-lived token or send null if the
   * refresh token is invalid
   * @param refreshToken
   */
  verifyAgentRefreshToken(refreshToken: string): Promise<string | null>;
}

export interface AuthLoginRequest {
  username: string;
  password: string;
}

export interface InitSuperAdminRequest {
  token: string;
}

export interface AgentAccessRequest {
  token: string;
}
