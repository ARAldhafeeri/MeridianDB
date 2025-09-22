import { Admin } from "@/entities/domain/admin";
import { BaseServiceImpl } from "./base";
import { AdminFilter, AdminRepository } from "@/repositories/admin";
import { IAdminService } from "@/entities/interfaces/services/admin";

export class AdminService
  extends BaseServiceImpl<Admin, AdminFilter>
  implements IAdminService
{
  constructor(adminRepository: AdminRepository) {
    super(adminRepository);
  }

  async findByEmail(email: string) {
    const found = await this.repository.findOne({ email: email });
    return found;
  }
}
