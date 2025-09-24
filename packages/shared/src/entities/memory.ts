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
  readonly isFactual: boolean; // always included when true, disregard of recencyScore , default false
  readonly isIrrelevant: boolean; // always disincluded when true disregard of recencyScore, default false
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
export interface MemoryRetrievalResult {
  readonly query: string;
}

export interface FeatureSearchResult {
  readonly query: string;
}

/**
 * create new episode
 */
export interface CreateMemoryEpisodeRequest {
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
  readonly isFactual: boolean; // always included when true, disregard of recencyScore , default false
  readonly isIrrelevant: boolean; // always disincluded when true disregard of recencyScore, default false
  // CONTEXTUAL FEATURES
  readonly context: string;

  // BEHAVIORAL FEATURES
  // Simpilfied version of behavioral focusing on
  // the impact of the memory on the success or failure
  readonly successRate: number; // o-1 updated on behavioral log
  positive: number;
  negative: number;
  readonly accessLevel: AccessLevel;
  readonly stage: MemoryStage;
}

/**
 * create new episode
 */
export interface UpdateMemoryEpisodeRequest {
  // Basic identification
  readonly agentId: string;
  readonly organizationId: string;
  readonly content?: string;

  // SEMANTIC FEATURES (derived from Vectorize preprocessing)

  // TEMPORAL FEATURES
  // 0-1, decays over time
  // updated every time the data the memory is acceessed.
  readonly recencyScore?: number; // decrease overtime
  readonly accessFrequency?: number; // 0-1 grows with usage
  readonly lastAccessedAt?: Date;
  // marked by human-in-loop true, recency is completly ignored, false, recency applies.
  readonly isFactual?: boolean; // always included when true, disregard of recencyScore , default false
  readonly isIrrelevant?: boolean; // always disincluded when true disregard of recencyScore, default false
  // CONTEXTUAL FEATURES
  readonly context?: string;

  // BEHAVIORAL FEATURES
  // Simpilfied version of behavioral focusing on
  // the impact of the memory on the success or failure
  readonly successRate?: number; // o-1 updated on behavioral log

  readonly accessLevel?: AccessLevel;
  readonly stage?: MemoryStage;
}

export interface MemoryFilter {}

/**
 * Multi-dimensional search
 */
export interface FeatureSearchRequest {
  readonly query: string;
}

export interface MemoryEpisodeFilter {
  agentId?: string;
  ids?: string[];
  organizationId?: string;
  environment?: "coding" | "research" | "conversation";
  taskType?: "problem_solving" | "learning" | "recall";
  isFactual?: boolean;
  isIrrelevant?: boolean;
  successRate?: number;
  stabilityThreshold?: number;
}
