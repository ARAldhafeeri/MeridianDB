import { ControllerContext } from "./context";

/**
 * Base agent controllers
 */
export interface AdminController {
  // create new agent
  login(context: ControllerContext): Promise<Response>;
}
