import { ControllerContext } from "./context";

export interface BehavioralController {
  // Feedback operations
  recordFeedback(context: ControllerContext): Promise<Response>;
  getFeedbackHistory(context: ControllerContext): Promise<Response>;

  // Decision tree operations
  updateDecisionTree(context: ControllerContext): Promise<Response>;
  getDecisionPatterns(context: ControllerContext): Promise<Response>;

  // Analytics operations
  getBehavioralAnalytics(context: ControllerContext): Promise<Response>;
  getRiskAssessment(context: ControllerContext): Promise<Response>;

  // Human audit operations
  submitAudit(context: ControllerContext): Promise<Response>;
}
