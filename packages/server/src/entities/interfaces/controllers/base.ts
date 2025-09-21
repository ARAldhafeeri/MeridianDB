import { ControllerContext } from "./context";

export interface BaseController {
  // CRUD operations
  create(context: ControllerContext): Promise<Response>;
  getById(context: ControllerContext): Promise<Response>;
  list(context: ControllerContext): Promise<Response>;
  update(context: ControllerContext): Promise<Response>;
  delete(context: ControllerContext): Promise<Response>;

  // Optional bulk operations
  bulkCreate?(context: ControllerContext): Promise<Response>;
  bulkUpdate?(context: ControllerContext): Promise<Response>;
  bulkDelete?(context: ControllerContext): Promise<Response>;
}
