import { ControllerContext } from "./context";

export interface MemoryController {
  // Episode operations
  storeEpisode(context: ControllerContext): Promise<Response>;
  searchMemories(context: ControllerContext): Promise<Response>;

  // Management operations
  consolidateMemories(context: ControllerContext): Promise<Response>;
  getStatistics(context: ControllerContext): Promise<Response>;
  pruneMemories(context: ControllerContext): Promise<Response>;

  // Cross-agent operations
  shareKnowledge(context: ControllerContext): Promise<Response>;
  getCrossAgentPatterns(context: ControllerContext): Promise<Response>;
}
