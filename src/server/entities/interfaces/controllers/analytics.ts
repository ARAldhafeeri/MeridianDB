import { ControllerContext } from "./context";

export interface AnalyticsController {
  getMetrics(context: ControllerContext): Promise<Response>;
  getBWT(context: ControllerContext): Promise<Response>;
  getForgettingCurves(context: ControllerContext): Promise<Response>;
  getTransferEfficiency(context: ControllerContext): Promise<Response>;
  getSystemMetrics(context: ControllerContext): Promise<Response>;
  createDashboard(context: ControllerContext): Promise<Response>;
  queryBitmaps(context: ControllerContext): Promise<Response>;
}
