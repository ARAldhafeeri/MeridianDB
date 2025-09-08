import { ConsolidationStage } from ".";
import { BaseEntity } from "./base";

/**
 * Vector embedding with context
 */
export interface VectorEmbedding extends BaseEntity {
  readonly nodeId: string;
  readonly organizationId: string;
  readonly agentId?: string;
  readonly model: string; // embedding model used
  readonly dimensions: number;
  readonly context: EmbeddingContext;
  /**
   * Stage of the consolidation of memory
   */
  readonly stage: ConsolidationStage;
  readonly importance: number;
  readonly accessCount: number;
  readonly lastAccessedAt?: Date;
}

export interface EmbeddingContext {
  readonly environment?: string;
  readonly task?: string;
  readonly goal?: string;
  readonly timestamp: Date;
  readonly parentContext?: string;
  readonly metadata: Record<string, unknown>;
}

/**
 * Memory episode for consolidation
 */
export interface MemoryEpisode extends BaseEntity {
  readonly agentId: string;
  readonly organizationId: string;
  readonly content: string;
  readonly vectorId: string;
  readonly nodeIds: string[];
  readonly context: EmbeddingContext;
  readonly importance: number;
  readonly novelty: number;
  readonly utility: number;
  readonly stage: ConsolidationStage;
  readonly consolidatedAt?: Date;
}
