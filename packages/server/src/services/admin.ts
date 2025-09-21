import { Admin } from "@/entities/domain/admin";
import { BaseServiceImpl } from "./base";
import { AdminFilter, AdminRepository } from "@/repositories/admin";

export class AdminService
  extends BaseServiceImpl<Admin, AdminFilter>
  implements AdminService
{
  constructor(adminRepository: AdminRepository) {
    super(adminRepository);
  }
}
