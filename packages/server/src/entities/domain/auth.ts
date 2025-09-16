export type { JWTPayload } from "@meridiandb/shared/src/entities/auth";

/**
 * Context-aware authorization parameters
 */
export interface AuthZParams {
  resourceType: string;
  resourceId?: string;
  action: string;
  context: Record<string, any>;
}

/**
 * Federation sharing policy
 */
export interface SharingPolicy {
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
