import { MemoryStage } from "@meridiandb/shared/src/entities/enums";
import { BaseEntity } from "./base";
import type { MemoryEpisode } from "@meridiandb/shared/dist/entities/memory";

/**
 * Semantic clusters for efficient grouping (minimal Vectorize usage)
 */
export interface SemanticCluster extends BaseEntity {
  readonly agentId?: string; // null for cross-agent clusters
  readonly organizationId: string;
  readonly clusterCentroid: number[]; // From Vectorize
  readonly memberCount: number;
  readonly avgImportance: number;
  readonly conceptSummary: string[];
}

/**
 * Store new episode (simplified)
 */
export interface StoreEpisodeRequest {
  readonly agentId: string;
  readonly content: string;
  readonly environment: string;
  readonly taskType: string;
  readonly goalCategory?: string;
  readonly context?: Record<string, unknown>;
  readonly initialImportance?: number;
}

/**
 * Memory retrieval (feature-based SQL)
 */
export interface MemoryRetrievalRequest {
  readonly agentId: string;
  readonly query: string;
  readonly featureWeights?: {
    semantic?: number;
    temporal?: number;
    contextual?: number;
    behavioral?: number;
  };
  readonly filters?: {
    environment?: string;
    task?: string;
    extra?: string;
  };
  readonly limit?: number;
}

export interface MemoryRetrievalResult {
  readonly episodes: FeatureSearchResult[];
  readonly totalMatches: number;
  readonly queryAnalysis: {
    readonly detectedEnvironment?: string;
    readonly detectedTaskType?: string;
    readonly semanticClusters: number[];
  };
  readonly performance: {
    readonly queryTimeMs: number;
    readonly indexesUsed: string[];
  };
}

export interface MemoryFilter {
  readonly agentId?: string;
  readonly organizationId?: string;
  readonly stage?: MemoryStage[];
  readonly environment?: string;
  readonly taskType?: string;
  readonly minImportance?: number;
  readonly maxAge?: number;
  readonly semanticClusterIds?: number[];
}

/**
 * Multi-dimensional search (pure SQL)
 */
export interface FeatureSearchRequest {
  readonly agentId: string;
  readonly query: string;
  readonly organizationId: string;

  // Feature weights for composite scoring
  readonly semanticWeight: number; // 0-1
  readonly temporalWeight: number; // 0-1
  readonly contextualWeight: number; // 0-1
  readonly behavioralWeight: number; // 0-1

  // Query context for matching
  readonly environment?: string;
  readonly taskType?: string;
  readonly goalCategory?: string;

  // Filtering
  readonly minImportance?: number;
  readonly maxAge?: number; // hours
  readonly excludeIds?: string[];
  readonly limit: number;
  readonly threshold?: number;
}

export interface FeatureSearchResult {
  readonly episode: MemoryEpisode;
  readonly compositeScore: number;
  readonly scoreBreakdown: {
    readonly semantic: number;
    readonly temporal: number;
    readonly contextual: number;
    readonly behavioral: number;
  };
  readonly explanation: string[];
}
