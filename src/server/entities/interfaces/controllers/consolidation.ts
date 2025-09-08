import { ControllerContext } from "./context";

export interface ConsolidationController {
  consolidate(context: ControllerContext): Promise<Response>;
  scheduleConsolidation(context: ControllerContext): Promise<Response>;
  getStatus(context: ControllerContext): Promise<Response>;
  replayMemories(context: ControllerContext): Promise<Response>;
  getBalance(context: ControllerContext): Promise<Response>;
  optimizeParameters(context: ControllerContext): Promise<Response>;
  getHistory(context: ControllerContext): Promise<Response>;
}
