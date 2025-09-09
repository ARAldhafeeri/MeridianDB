import { ControllerContext } from "./context";

/**
 * Base agent controllers
 */
export interface AgentController {
  // create new agent
  create(context: ControllerContext): Promise<Response>;
  // get agent by id
  getById(context: ControllerContext): Promise<Response>;
  // list agents
  list(context: ControllerContext): Promise<Response>;
  // update agent
  update(context: ControllerContext): Promise<Response>;
  // delete agent
  delete(context: ControllerContext): Promise<Response>;
  // intialize agent
  initialize(context: ControllerContext): Promise<Response>;
  // get status of the agent
  getStatus(context: ControllerContext): Promise<Response>;
}
