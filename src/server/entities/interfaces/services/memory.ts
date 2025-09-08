import { AdvancedSearchRequest } from "../../domain/dto";
import {
  AccessPatterns,
  MemoryRetrievalRequest,
  MemoryRetrievalResult,
  MemoryStatistics,
  MemoryTransferRequest,
  PruneMemoriesRequest,
  PruneResult,
  StoreEpisodeRequest,
  TransferResult,
} from "../../domain/memory";
import { SearchResult } from "../../domain/responses";
import { MemoryEpisode } from "../../domain/vector";
import { ServiceContext, ServiceResult } from "./base";

/**
 * Service for memory operations and episode management
 * Handles the core memory lifecycle from episodic to consolidated
 */
export interface MemoryService {
  /**
   * Store new episodic memory
   */
  storeEpisode(
    episode: StoreEpisodeRequest,
    context: ServiceContext
  ): Promise<ServiceResult<MemoryEpisode>>;

  /**
   * Retrieve memories by various criteria
   */
  retrieveMemories(
    request: MemoryRetrievalRequest,
    context: ServiceContext
  ): Promise<ServiceResult<MemoryRetrievalResult>>;

  /**
   * Search memories using multi-dimensional similarity
   */
  searchMemories(
    request: AdvancedSearchRequest,
    context: ServiceContext
  ): Promise<ServiceResult<SearchResult[]>>;

  /**
   * Get memory statistics for an agent
   */
  getMemoryStatistics(
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<MemoryStatistics>>;

  /**
   * Prune old or low-importance memories
   */
  pruneMemories(
    request: PruneMemoriesRequest,
    context: ServiceContext
  ): Promise<ServiceResult<PruneResult>>;

  /**
   * Transfer memories between agents
   */
  transferMemories(
    request: MemoryTransferRequest,
    context: ServiceContext
  ): Promise<ServiceResult<TransferResult>>;

  /**
   * Get memory access patterns and usage analytics
   */
  getAccessPatterns(
    agentId: string,
    timeWindow: number,
    context: ServiceContext
  ): Promise<ServiceResult<AccessPatterns>>;

  /**
   * Update memory importance scores
   */
  updateImportance(
    memoryIds: string[],
    importance: number,
    context: ServiceContext
  ): Promise<ServiceResult<number>>;
}
