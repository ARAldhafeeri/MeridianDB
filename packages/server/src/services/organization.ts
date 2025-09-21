import { Organization } from "@meridiandb/shared/src/entities/organization";
import { BaseServiceImpl } from "./base";
import { OrganizationFilter } from "@/repositories/organization";

export class OrganizationService
  extends BaseServiceImpl<Organization, OrganizationFilter>
  implements OrganizationService {}
