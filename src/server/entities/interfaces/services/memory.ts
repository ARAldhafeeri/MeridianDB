import { MemoryStatistics } from "../../domain/analytics";
import { ConsolidationRequest } from "../../domain/dto";
import {
  MemoryRetrievalRequest,
  MemoryRetrievalResult,
  StoreEpisodeRequest,
} from "../../domain/memory";
import { ConsolidationResult } from "../../domain/responses";
import { MemoryEpisode } from "../../domain/vector";
import { ServiceContext, ServiceResult } from "./base";

/**
 * Memory service with tabular operations
 */
export interface MemoryService {
  // Core operations
  storeEpisode(
    request: StoreEpisodeRequest
  ): Promise<ServiceResult<MemoryEpisode>>;
  retrieveMemories(
    request: MemoryRetrievalRequest
  ): Promise<ServiceResult<MemoryRetrievalResult>>;

  // Consolidation
  consolidateMemories(
    request: ConsolidationRequest
  ): Promise<ServiceResult<ConsolidationResult>>;

  // Analytics
  getStatistics(agentId: string): Promise<ServiceResult<MemoryStatistics>>;

  // Cross-agent sharing
  shareKnowledge(
    sourceAgentId: string,
    targetAgentId: string,
    clusterIds: number[]
  ): Promise<ServiceResult<number>>;
}
