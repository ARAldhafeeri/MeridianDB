import { AccessLevel, MemoryStage } from ".";
import { BaseEntity } from "./base";

/**
 * Core memory episode with explicit features (replaces complex graph)
 */
export interface MemoryEpisode extends BaseEntity {
  // Basic identification
  readonly agentId: string;
  readonly organizationId: string;
  readonly content: string;

  // SEMANTIC FEATURES (derived from Vectorize preprocessing)

  // TEMPORAL FEATURES
  // 0-1, decays over time
  // updated every time the data the memory is acceessed.
  readonly recencyScore: number; // decrease overtime
  readonly accessFrequency: number; // 0-1 grows with usage
  readonly lastAccessedAt?: Date;
  readonly noveltyScore: number; // 1-0, decreases over time
  // marked by human-in-loop true, recency is completly ignored, false, recency applies.
  readonly factual: boolean; // always included when true, disregard of recencyScore , default false
  readonly irrelavent: boolean; // always disincluded when true disregard of recencyScore, default false
  // CONTEXTUAL FEATURES
  readonly environment: string; // 'coding', 'research', 'conversation'
  readonly task: string; // task description
  readonly extra: string; // any extra details.

  // BEHAVIORAL FEATURES
  // should be in an entity by itself
  // it's feedback on memory not part of the memory
  // memories will be used as part of decision tree
  // to decide the success or failure of the task

  readonly accessLevel: AccessLevel;
  readonly stage: MemoryStage;
}

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
