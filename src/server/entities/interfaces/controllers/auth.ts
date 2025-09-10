import { ControllerContext } from "./context";

export interface AuthService {
  /**
   * Admin login - opensource version have env vars
   * which is email, password upon which admin credentials are created
   * as well admin parent org is created
   */
  login(context: ControllerContext): Promise<Response>;

  /**
   * get refresh token based on access token which is linked
   * to agent and/or organization
   */
  getToken(context: ControllerContext): Promise<Response>;
}
