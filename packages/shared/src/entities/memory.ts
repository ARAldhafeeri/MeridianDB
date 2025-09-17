import { BaseEntity } from "./base";
import { AccessLevel, MemoryStage } from "./enums";

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
  // marked by human-in-loop true, recency is completly ignored, false, recency applies.
  readonly factual: boolean; // always included when true, disregard of recencyScore , default false
  readonly irrelavent: boolean; // always disincluded when true disregard of recencyScore, default false
  // CONTEXTUAL FEATURES
  readonly context: string;

  // BEHAVIORAL FEATURES
  // Simpilfied version of behavioral focusing on
  // the impact of the memory on the success or failure
  readonly successRate: number; // o-1 updated on behavioral log

  readonly accessLevel: AccessLevel;
  readonly stage: MemoryStage;
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

/**
 * Store new episode (simplified)
 */
export interface StoreEpisodeRequest {
  readonly agentId: string;
  readonly content: string;
  readonly context: string;
  readonly initialImportance?: number;
}

export interface MemoryFilter {}

/**
 * Multi-dimensional search
 */
export interface FeatureSearchRequest {
  readonly query: string;
}
