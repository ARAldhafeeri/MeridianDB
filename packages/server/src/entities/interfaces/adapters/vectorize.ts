/**
 * Adapter contract for interacting with Cloudflare Vectorize (vector database).
 */

export interface VectorizeVector {
  id: string;
  values: number[];
  metadata?: Record<string, any>;
  namespace?: string;
}

export interface VectorizeQueryOptions {
  topK?: number;
  namespace?: string;
  filter?: Record<string, any>;
  returnValues?: boolean;
  returnMetadata?: boolean;
}

export interface VectorizeMatch {
  id: string;
  score: number;
  values?: number[];
  metadata?: Record<string, any>;
}

export interface VectorizeQueryResult {
  success: boolean;
  matches?: VectorizeMatch[];
  count?: number;
}

export interface VectorizeUpsertResult {
  success: boolean;
  count?: number;
  ids?: string[];
}

export interface VectorizeInfo {
  dimensions: number;
  metric: "cosine" | "euclidean" | "dot-product";
  vectors: number;
}

/**
 * Minimal Vectorize client interface used by repositories to execute operations.
 */
export interface IVectorizeClient {
  /**
   * Query vectors by similarity
   */
  query(
    vector: number[],
    opts?: VectorizeQueryOptions
  ): Promise<VectorizeQueryResult>;

  /**
   * Upsert vectors with optional metadata
   */
  upsert(
    vectors: VectorizeVector[],
    opts?: { namespace?: string }
  ): Promise<VectorizeUpsertResult>;

  /**
   * Delete vectors by IDs
   */
  delete(
    ids: string[],
    opts?: { namespace?: string }
  ): Promise<{ success: boolean }>;
}
