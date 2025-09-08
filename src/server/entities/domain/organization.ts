import { BaseEntity } from "./base";
import { FederationSettings } from "./federation";

/**
 * Organization context for multi-tenancy
 */
export interface Organization extends BaseEntity {
  readonly name: string;
  readonly tier?: "free" | "pro" | "enterprise";
  readonly quotas?: OrganizationQuotas;
  readonly federationSettings: FederationSettings;
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
