import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";

export interface EmbeddingResponse {
  shape: number[];
  data: number[];
}

/**
 * Ai adapter used in inserting and quering from samnatic search
 * expect text and array of MemoryEpisode
 */
export interface IAiAdapter {
  /**
   * create single embedding for single memory
   * @param memories - meridiandb memories to create embeddings for.
   */
  getUpsertVectorizeEmbeddings(
    memories: MemoryEpisode
  ): Promise<EmbeddingResponse>;

  /**
   * Return embeddings of the user query
   * @param query user query as string
   */
  getUserQueryVectorizeEmbeddings(query: string): Promise<EmbeddingResponse>;
}
