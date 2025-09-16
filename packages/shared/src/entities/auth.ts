/**
 * JWT payload structure
 */
export interface JWTPayload {
  orgId: string;
  agentId?: string;
  userId?: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iat: number;
}
