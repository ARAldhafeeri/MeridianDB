import { ControllerContext } from "./context";

export interface MemoryController {
  storeEpisode(context: ControllerContext): Promise<Response>;
  retrieveMemories(context: ControllerContext): Promise<Response>;
  searchMemories(context: ControllerContext): Promise<Response>;
  getStatistics(context: ControllerContext): Promise<Response>;
  pruneMemories(context: ControllerContext): Promise<Response>;
  transferMemories(context: ControllerContext): Promise<Response>;
  getAccessPatterns(context: ControllerContext): Promise<Response>;
}
