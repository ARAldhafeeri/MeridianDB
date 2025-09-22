import { Admin } from "@/entities/domain/admin";
import { BaseService } from "./base";

export interface IAdminService extends BaseService<Admin> {
  findByEmail(email: string): Promise<Admin | null>;
}
