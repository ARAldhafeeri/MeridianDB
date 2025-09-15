/**
 * JWT payload structure
 */
interface JWTPayload {
  orgId: string;
  agentId?: string;
  userId?: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iat: number;
}

/**
 * Context-aware authorization parameters
 */
interface AuthZParams {
  resourceType: string;
  resourceId?: string;
  action: string;
  context: Record<string, any>;
}

/**
 * Federation sharing policy
 */
interface SharingPolicy {
  allowedRelations: string[];
  maxDepth: number;
  anonymization: {
    enabled: boolean;
    fields: string[];
  };
  qualityThreshold: number;
  usageLimits: {
    maxQueries: number;
    timeWindow: number;
  };
}
