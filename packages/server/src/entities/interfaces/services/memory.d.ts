import { ConsolidationRequest } from "../../domain/dto";
import { MemoryRetrievalRequest, MemoryRetrievalResult, StoreEpisodeRequest } from "../../domain/memory";
import { ConsolidationResult } from "../../domain/responses";
import { MemoryEpisode } from "../../domain/vector";
import { ServiceResult } from "./base";
/**
 * Memory service with tabular operations
 */
export interface MemoryService {
    storeEpisode(request: StoreEpisodeRequest): Promise<ServiceResult<MemoryEpisode>>;
    retrieveMemories(request: MemoryRetrievalRequest): Promise<ServiceResult<MemoryRetrievalResult>>;
    consolidateMemories(request: ConsolidationRequest): Promise<ServiceResult<ConsolidationResult>>;
    shareKnowledge(sourceAgentId: string, targetAgentId: string, clusterIds: number[]): Promise<ServiceResult<number>>;
}
//# sourceMappingURL=memory.d.ts.map