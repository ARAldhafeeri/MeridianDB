import { BaseEntity } from "./base";

/**
 * Organization context for multi-tenancy
 */
export interface Organization extends BaseEntity {
  readonly name: string;
}

export interface OrganizationFilter {
  name: string;
}
