import { ControllerContext } from "./context";

export interface RetrievalController {
  advancedSearch(context: ControllerContext): Promise<Response>;
  graphRAGSearch(context: ControllerContext): Promise<Response>;
  compensatedSearch(context: ControllerContext): Promise<Response>;
  getRecommendations(context: ControllerContext): Promise<Response>;
  explainResults(context: ControllerContext): Promise<Response>;
  federatedSearch(context: ControllerContext): Promise<Response>;
  getAnalytics(context: ControllerContext): Promise<Response>;
}
