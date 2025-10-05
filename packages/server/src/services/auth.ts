import { IAuthService } from "@/entities/interfaces/services/auth";
import { AdminService } from "./admin";
import { AccessService } from "./access";
import { PasswordService } from "./password";
import { v4 as uuidv4 } from "uuid";
import { getAdminEmail, getAdminPassword } from "@/config/context";
import { OrganizationService } from "./organization";
import { AgentService } from "./agent";

class AuthService implements IAuthService {
  constructor(
    private adminService: AdminService,
    private accessService: AccessService,
    private passwordService: PasswordService,
    private organizationService: OrganizationService,
    private agentService: AgentService
  ) {}

  /**
   * Create jwt token for super admin
   * @param email email of super admin
   * @param password password of super admin
   * @returns
   */
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
        organizationId: admin.organizationId,
      },
      "1d"
    );
    return { token: jwt };
  }

  /**
   * Safe endpoint to initialize the super admin
   * Should use some kind one time usage token for extra security
   * @param adminEmail
   * @param adminPassword
   * @returns
   */
  async initSuperAdmin(adminEmail?: string, adminPassword?: string) {
    // Use provided values or fall back to context (with fallback)
    const email = adminEmail || getAdminEmail();
    const password = adminPassword || getAdminPassword();
    const found = await this.adminService.findByEmail(email);
    if (found) {
      return found;
    }
    const { salt, hashedPassword } = await this.passwordService.createPassword(
      password
    );

    // find first
    const foundOrg = await this.organizationService.list({ name: "first" }, {});

    let org;

    if (foundOrg.data.length > 0) {
      org = foundOrg.data[0];
    }

    org = await this.organizationService.create({
      name: "first",
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    });

    console.log("org id", org.id);

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

  async refreshAgentToken(refreshToken: string): Promise<string | null> {
    // verify refresh token
    const token = await this.accessService.verifyToken(refreshToken);

    // invalid or expired user need to get new refresh token
    if (!token) return null;

    // valid token
    return token;
  }

  async verifyAccessToken(accessToken: string): Promise<string | null> {
    const token = await this.accessService.verifyToken(accessToken);
    const agent = await this.agentService.getById(token.agentId);

    // access token invalid
    if (accessToken !== agent.accessToken) return null;

    // generate new refresh token 5m live-time
    const newToken = this.accessService.generateToken(
      {
        agentId: agent.id,
      },
      "5m"
    );

    return newToken;
  }
}

export default AuthService;
