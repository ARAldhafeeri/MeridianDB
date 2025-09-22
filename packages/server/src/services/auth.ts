import { IAuthService } from "@/entities/interfaces/services/auth";
import { AdminService } from "./admin";
import { AccessService } from "./access";
import { PasswordService } from "./password";
import { v4 as uuidv4 } from "uuid";
import { getAdminEmail, getAdminPassword } from "@/config/context";
import { OrganizationService } from "./organization";

class AuthService implements IAuthService {
  constructor(
    private adminService: AdminService,
    private accessService: AccessService,
    private passwordService: PasswordService,
    private organizationService: OrganizationService
  ) {}

  async login(email: string, password: string) {
    // get or create admin

    const admin = await this.adminService.findByEmail(email);
    // admin intialized verify password and return token

    if (!admin) {
      return { token: null };
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      password,
      admin.hash,
      admin.salt
    );
    if (!isPasswordValid) {
      return { token: null };
    }

    const jwt = this.accessService.generateToken(
      {
        adminId: admin.id,
      },
      "1d"
    );
    return { token: jwt };
  }

  async initSuperAdmin(adminEmail?: string, adminPassword?: string) {
    // Use provided values or fall back to context (with fallback)
    const email = adminEmail || getAdminEmail();
    const password = adminPassword || getAdminPassword();
    console.log("data", email, password);
    const found = await this.adminService.findByEmail(email);
    if (found) {
      return found;
    }
    const { salt, hashedPassword } = await this.passwordService.createPassword(
      password
    );

    // create org
    const org = await this.organizationService.create({
      name: "",
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    });

    const created = await this.adminService.create({
      email: email,
      salt: salt,
      firstName: "",
      lastName: "",
      organizationId: org.id,
      hash: hashedPassword,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    });
    return created;
  }
}

export default AuthService;
