/**
 * Authentication & authorization service interface.
 * Responsibilities:
 * - Validate JWT tokens
 * - Enforce fine-grained memory permissions
 * - Context-aware gates used by controllers
 */

import { Admin } from "../../domain/admin";

export interface AuthService {
  /**
   * Validate a token and return principal claims (orgId, agentId, roles, scopes).
   */
  validateToken(token: string): Promise<{
    valid: boolean;
    orgId?: string;
    agentId?: string;
    roles?: string[];
    scopes?: string[];
    reason?: string;
  }>;

  /**
   * Check whether a principal may access a specific node/edge/embedding.
   */
  authorizeRead(
    principal: { orgId?: string; agentId?: string; roles?: string[] },
    resource: { orgId: string; resourceType: "node" | "edge" | "embedding" }
  ): Promise<boolean>;

  /**
   * Check whether principal may write/update a resource.
   */
  authorizeWrite(
    principal: { orgId?: string; agentId?: string; roles?: string[] },
    action: { resourceType: string; orgId: string }
  ): Promise<boolean>;

  /**
   * Admin login - opensource version have env vars
   * which is email, password upon which admin credentials are created
   * as well admin parent org is created
   */
  login(eamil: string, password: string): Promise<boolean>;

  /**
   * inialize super admin based on config
   */
  initializeSuperAdmin(admin: Admin): Promise<boolean>;

  /**
   * get refresh token based on access token which is linked
   * to agent and/or organization
   */
  getToken(accessToken: string): Promise<string>;
}
