import { Organization } from "@meridiandb/shared/src/entities/organization";
import { BaseService } from "./base";
import { OrganizationFilter } from "@/repositories/organization";

export interface OrganizationService
  extends BaseService<Organization, OrganizationFilter> {
  updatedOrCreate(org: Organization): Promise<Organization>;
}
