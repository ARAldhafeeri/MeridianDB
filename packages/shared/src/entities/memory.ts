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
