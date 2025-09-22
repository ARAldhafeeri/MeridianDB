import { ControllerContext } from "./context";

export interface IAuthController {
  /**
   * Admin login - opensource version have env vars
   * which is email, password upon which admin credentials are created
   * as well admin parent org is created
   */
  login(context: ControllerContext): Promise<Response>;

  /**
   * initialize super admin endpoint , SUPER_ADMIN_TOKEN is required
   */
  initSuperAdmin(context: ControllerContext): Promise<Response>;
}
