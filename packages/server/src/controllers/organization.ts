import { Organization } from "@/entities/domain/organization";
import { BaseControllerImpl } from "./base";
import { OrganizationService } from "@/entities/interfaces/services/organization";
import { OrganizationFilter } from "@/validators/organization";

export class OrganizationController extends BaseControllerImpl<
  Organization,
  OrganizationFilter
> {
  constructor(service: OrganizationService) {
    super(service);
  }
}
