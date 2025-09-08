import { ConsolidationStage } from ".";
import { EmbeddingContext, MemoryEpisode } from "./vector";

/**
 * Request to store memory episode of the AI agent.
 */
export interface StoreEpisodeRequest {
  readonly agentId: string;
  readonly content: string;
  readonly context: EmbeddingContext;
  readonly nodeIds?: string[];
  readonly importance?: number;
  readonly novelty?: number;
  readonly utility?: number;
}

/**
 * Reterive memory request from the ai agent
 */
export interface MemoryRetrievalRequest {
  readonly agentId: string;
  readonly stage?: ConsolidationStage[];
  readonly timeWindow?: number; // hours
  readonly importanceMin?: number;
  readonly limit?: number;
  readonly includeContext?: boolean;
  readonly sortBy?: "importance" | "novelty" | "utility" | "timestamp";
}

/**
 * Result of retrieving memory from the store.
 */
export interface MemoryRetrievalResult {
  readonly episodes: MemoryEpisode[];
  readonly totalCount: number;
  readonly aggregateMetrics: {
    readonly avgImportance: number;
    readonly avgNovelty: number;
    readonly avgUtility: number;
  };
}

/**
 * analytics of agentic memory
 */
export interface MemoryStatistics {
  readonly agentId: string;
  readonly totalEpisodes: number;
  readonly byStage: Record<ConsolidationStage, number>;
  readonly memoryEfficiency: number;
  readonly compressionRatio: number;
  readonly accessFrequency: Record<string, number>;
  readonly retentionCurve: Array<{ age: number; retention: number }>;
}

/**
 * Prune Memories
 */
export interface PruneMemoriesRequest {
  readonly agentId: string;
  readonly strategy: "age" | "importance" | "utility" | "redundancy";
  readonly threshold: number;
  readonly dryRun?: boolean;
  readonly preserveCount?: number;
}

/**
 * Prune result
 */
export interface PruneResult {
  readonly prunedCount: number;
  readonly preservedCount: number;
  readonly spaceSaved: number; // bytes
  readonly affectedNodes: string[];
}

/**
 * Transfer memory from two agent source and target.
 */
export interface MemoryTransferRequest {
  readonly sourceAgentId: string;
  readonly targetAgentId: string;
  readonly memoryIds?: string[];
  readonly transferType: "copy" | "move";
  readonly preserveContext?: boolean;
  readonly adaptToTarget?: boolean;
}

/**
 * The result of transfering the AI agent.
 */
export interface TransferResult {
  readonly transferredCount: number;
  readonly adaptedCount: number;
  readonly conflictCount: number;
  readonly transferEfficiency: number;
}

/**
 * Recording access patterns.
 */
export interface AccessPatterns {
  readonly agentId: string;
  readonly hotMemories: string[];
  readonly coldMemories: string[];
  readonly accessFrequency: Record<string, number>;
  readonly temporalPatterns: Array<{ hour: number; accessCount: number }>;
  readonly contextPatterns: Record<string, number>;
}
