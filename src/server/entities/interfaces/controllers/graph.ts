import { ControllerContext } from "./context";

export interface GraphController {
  createNode(context: ControllerContext): Promise<Response>;
  getNode(context: ControllerContext): Promise<Response>;
  updateNode(context: ControllerContext): Promise<Response>;
  deleteNode(context: ControllerContext): Promise<Response>;
  createEdge(context: ControllerContext): Promise<Response>;
  getEdge(context: ControllerContext): Promise<Response>;
  updateEdge(context: ControllerContext): Promise<Response>;
  deleteEdge(context: ControllerContext): Promise<Response>;
  getNeighbors(context: ControllerContext): Promise<Response>;
  getSubgraph(context: ControllerContext): Promise<Response>;
  findPath(context: ControllerContext): Promise<Response>;
}
