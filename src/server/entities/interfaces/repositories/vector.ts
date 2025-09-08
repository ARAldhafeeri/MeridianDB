import { BaseEntity } from "../../domain/base";
import {
  AdvancedSearchRequest,
  VectorFilter,
  VectorSearchParams,
} from "../../domain/dto";
import { SearchResult } from "../../domain/responses";
import { VectorEmbedding } from "../../domain/vector";

/**
 * Repository for vector operations using Cloudflare Vectorize
 * Handles embedding storage, retrieval, and similarity search
 */
export interface VectorRepository {
  /**
   * Store vector embedding
   */
  store(
    embedding: Omit<VectorEmbedding, keyof BaseEntity>,
    vector: number[]
  ): Promise<VectorEmbedding>;

  /**
   * Store multiple embeddings in batch
   */
  storeBatch(
    embeddings: Array<{
      metadata: Omit<VectorEmbedding, keyof BaseEntity>;
      vector: number[];
    }>
  ): Promise<VectorEmbedding[]>;

  /**
   * Retrieve embedding by ID
   */
  retrieve(
    id: string
  ): Promise<{ embedding: VectorEmbedding; vector: number[] } | null>;

  /**
   * Delete embedding
   */
  delete(id: string): Promise<boolean>;

  /**
   * Update embedding vector and metadata
   */
  update(
    id: string,
    vector?: number[],
    metadata?: Partial<VectorEmbedding>
  ): Promise<VectorEmbedding>;

  /**
   * Semantic similarity search
   */
  similaritySearch(params: VectorSearchParams): Promise<VectorSearchResult[]>;

  /**
   * Multi-dimensional similarity search with custom scoring
   */
  advancedSearch(request: AdvancedSearchRequest): Promise<SearchResult[]>;

  /**
   * Find vectors within distance threshold
   */
  radiusSearch(
    query: number[],
    radius: number,
    filter?: VectorFilter
  ): Promise<VectorSearchResult[]>;

  /**
   * Get vector statistics for optimization
   */
  getStatistics(organizationId?: string): Promise<VectorStatistics>;

  /**
   * Batch update vectors for drift compensation
   */
  compensateDrift(
    updates: Array<{ id: string; vector: number[] }>
  ): Promise<number>;
}

export interface VectorSearchResult {
  readonly id: string;
  readonly score: number;
  readonly metadata: VectorEmbedding;
  readonly vector?: number[];
}

export interface VectorStatistics {
  readonly totalVectors: number;
  readonly averageDimensions: number;
  readonly distributionStats: {
    readonly mean: number[];
    readonly variance: number[];
    readonly quantiles: Record<string, number[]>;
  };
  readonly accessPatterns: {
    readonly hotVectors: string[];
    readonly coldVectors: string[];
    readonly avgAccessFrequency: number;
  };
}
