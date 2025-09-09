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
  readonly semanticClusterId?: number;
  readonly semanticDensity: number; // 0-1 cluster density
  readonly conceptTags: string[]; // Extracted concepts

  // TEMPORAL FEATURES
  readonly recencyScore: number; // 0-1, decays over time
  readonly accessFrequency: number;
  readonly lastAccessedAt?: Date;

  // CONTEXTUAL FEATURES
  readonly environment: string; // 'coding', 'research', 'conversation'
  readonly taskType: string; // 'problem_solving', 'learning', 'recall'
  readonly goalCategory: string;

  // BEHAVIORAL FEATURES
  readonly retrievalSuccessRate: number; // 0-1
  readonly utilizationScore: number; // 0-1

  // IMPORTANCE SCORING (replaces complex consolidation)
  readonly consolidatedImportance: number; // 0-1, grows with usage
  readonly noveltyScore: number; // 1-0, decreases over time

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
 * Memory relationships (simplified from complex edges)
 */
export interface MemoryRelationship extends BaseEntity {
  readonly sourceEpisodeId: string;
  readonly targetEpisodeId: string;
  readonly relationshipType:
    | "temporal_sequence"
    | "semantic_similarity"
    | "contextual_link";
  readonly strength: number; // 0-1
  readonly confidence: number; // 0-1
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
    taskType?: string;
    minImportance?: number;
    maxAge?: number;
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
