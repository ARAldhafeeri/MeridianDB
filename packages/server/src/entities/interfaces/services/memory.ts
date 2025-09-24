import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
import { MemoryRetrievalRequest } from "../../domain/memory";
import { BaseService } from "./base";

/**
 * Memory service with tabular operations
 */
export interface MemoryService extends BaseService<MemoryEpisode> {
  sharedMemoryRetrieval(
    request: MemoryRetrievalRequest
  ): Promise<MemoryEpisode[]>;
  singleMemoryRetrieval(
    request: MemoryRetrievalRequest
  ): Promise<MemoryEpisode[]>;
}
