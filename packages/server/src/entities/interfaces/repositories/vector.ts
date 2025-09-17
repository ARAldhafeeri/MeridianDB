import { MemoryEpisode } from "../../domain/vector";

/**
 * Minimal vector repository (Vectorize preprocessing only)
 */
export interface SemanticClusterRepository {
  // Cluster management
  insertSemanticMemory(memory: MemoryEpisode): Promise<any>;
  semanticSearch(query: number[]): Promise<any>;
}
