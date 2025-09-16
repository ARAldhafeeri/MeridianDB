import { BaseEntity } from "./base";

/**
 * Organization context for multi-tenancy
 */
export interface Organization extends BaseEntity {
  readonly name: string;
  readonly tier?: "free" | "pro" | "enterprise";
  readonly quotas?: OrganizationQuotas;
}

/**
 * Organization qoutes for later on platform or saas version
 */
export interface OrganizationQuotas {
  readonly maxNodes: number;
  readonly maxVectors: number;
  readonly maxAgents: number;
  readonly storageGb: number;
  readonly monthlyQueries: number;
}
