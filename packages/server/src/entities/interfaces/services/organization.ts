import {
  Organization,
  OrganizationFilter,
} from "@meridiandb/shared/src/entities/organization";
import { BaseService } from "./base";

export interface OrganizationService
  extends BaseService<Organization, OrganizationFilter> {
  updatedOrCreate(org: Organization): Promise<Organization>;
}
