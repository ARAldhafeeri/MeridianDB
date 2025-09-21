import {
  Organization,
  OrganizationFilter,
} from "@meridiandb/shared/src/entities/organization";
import { BaseServiceImpl } from "./base";

export class OrganizationService
  extends BaseServiceImpl<Organization, OrganizationFilter>
  implements OrganizationService
{
  async updatedOrCreate(request: Organization): Promise<Organization> {
    const found = await this.repository.findOne({ id: request.id });

    if (found?.id) {
      return this.repository.update(request.id, request);
    }

    return this.repository.create(request);
  }
}
