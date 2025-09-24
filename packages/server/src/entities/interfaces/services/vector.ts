import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
import { VectorizeQueryResult } from "../repositories/vector";

/**
 * Minimal vector repository (Vectorize preprocessing only)
 */
export interface IVictorizeService {
  /**
   * turn d1 inserted records into embeddings and store them
   * within vectorize
   *
   * @param memories - d1 inserted records
   */
  insert(memories: MemoryEpisode[]): Promise<string>;

  /**
   * turn user query into embeddings and fetch results from vectorize
   * @param query -  user query description of what data is needed as string
   */
  search(query: string): Promise<VectorizeQueryResult>;
}
