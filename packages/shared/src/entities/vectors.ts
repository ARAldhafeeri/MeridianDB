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
}

export interface EmbeddingContext {
  readonly environment?: string;
  readonly task?: string;
  readonly goal?: string;
  readonly timestamp: Date;
  readonly parentContext?: string;
  readonly metadata: Record<string, unknown>;
}
