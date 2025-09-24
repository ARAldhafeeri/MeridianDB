/**
 * Minimal vector repository for query and insert from vectorize index
 */
export interface IVictorizeRepository {
  /**
   * Insert document within vectorize
   *
   * @param memories - data membedded within vectorize.
   */
  insert(memories: VectorizeVector[]): Promise<string>;

  /**
   * Reterive results from vectorize.
   * @param query - embedded user query
   */
  search(query: number[]): Promise<VectorizeQueryResult>;
}

export interface VectorizeQueryResult {
  /**
   * number of matches
   */
  count: number;
  /**
   * Retreived matches
   */
  matches: VectorizeMatch[];
}
