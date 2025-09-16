import { EmbeddingContext } from "@meridiandb/shared/src/entities/vectors";
import { BaseEntity } from "./base";

export type { VectorEmbedding } from "@meridiandb/shared/src/entities/vectors";

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
  readonly consolidatedAt?: Date;
}
