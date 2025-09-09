import { MemoryStatistics } from "../entities/domain/analytics";
import { BaseEntity } from "../entities/domain/base";
import {
  ConsolidationRequest,
  PaginatedResponse,
} from "../entities/domain/dto";
import {
  FeatureSearchRequest,
  FeatureSearchResult,
  MemoryFilter,
} from "../entities/domain/memory";
import { MemoryEpisode } from "../entities/domain/vector";

/**
 * Primary memory repository (D1-based)
 */
export interface MemoryRepository {
  // Episode CRUD
  storeEpisode(
    episode: Omit<MemoryEpisode, keyof BaseEntity>
  ): Promise<MemoryEpisode>;
  findEpisode(
    id: string,
    organizationId?: string
  ): Promise<MemoryEpisode | null>;
  findEpisodes(filter: MemoryFilter): Promise<PaginatedResponse<MemoryEpisode>>;
  updateEpisode(
    id: string,
    updates: Partial<MemoryEpisode>
  ): Promise<MemoryEpisode>;

  // Feature-based search (primary method)
  searchByFeatures(
    request: FeatureSearchRequest
  ): Promise<FeatureSearchResult[]>;

  // Consolidation operations (batch SQL)
  identifyConsolidationCandidates(
    request: ConsolidationRequest
  ): Promise<MemoryEpisode[]>;
  batchUpdateImportance(
    episodeIds: string[],
    importanceBoost: number
  ): Promise<number>;
  batchUpdateRecency(agentId: string, decayFactor: number): Promise<number>;

  // Analytics queries
  getMemoryStatistics(agentId: string): Promise<MemoryStatistics>;
  // getCrossAgentPatterns(organizationId: string): Promise<[]>;

  // // Cleanup operations
  // pruneEpisodes(agentId: string, criteria: PruneCriteria): Promise<PruneResult>;
}
