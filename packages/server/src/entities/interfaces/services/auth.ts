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
}

export interface AuthLoginRequest {
  username: string;
  password: string;
}
