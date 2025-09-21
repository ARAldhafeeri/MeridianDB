import { Organization } from "@/entities/domain/organization";
import { BaseControllerImpl } from "./base";
import { OrganizationService } from "@/entities/interfaces/services/organization";

// Define the filter type based on what we expect after removing pagination params
interface OrganizationFilterParams {
  name?: string;
  email?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export class OrganizationController extends BaseControllerImpl<
  Organization,
  OrganizationFilterParams
> {
  constructor(organizationService: OrganizationService) {
    super(organizationService);
  }
}
