import { ControllerContext } from "./context";

export interface FederationController {
  registerPartnership(context: ControllerContext): Promise<Response>;
  shareKnowledge(context: ControllerContext): Promise<Response>;
  requestKnowledge(context: ControllerContext): Promise<Response>;
  updatePolicies(context: ControllerContext): Promise<Response>;
  getAnalytics(context: ControllerContext): Promise<Response>;
  auditActivity(context: ControllerContext): Promise<Response>;
  revokeAccess(context: ControllerContext): Promise<Response>;
}
