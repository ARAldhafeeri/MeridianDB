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
   * Reterive results from vectorize for single agent or shared memory.
   * At memory service abstraction level two methods will use this
   * one to reterieve memories for single agent.
   * but single agent can reterieve multiple memories.
   * enterprise version should implement federation and rbac.
   * @param query - embedded user query
   * @param filter - optional fitler for single agent or multi-agent shared memory search
   */
  search(
    query: number[],
    filter?: VectorizeMetaDataFilter
  ): Promise<VectorizeQueryResult>;
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

export interface VectorizeMetaDataFilter {
  agentId?: string;
}
