import { SemanticCluster } from "../entities/domain/memory";

/**
 * Minimal vector repository (Vectorize preprocessing only)
 */
export interface SemanticClusterRepository {
  // Cluster management
  findOrCreateCluster(
    centroid: number[],
    agentId?: string
  ): Promise<SemanticCluster>;
  findSimilarClusters(
    centroid: number[],
    threshold: number
  ): Promise<SemanticCluster[]>;
  updateClusterStats(clusterId: number): Promise<void>;

  // Feature extraction for D1 storage
  extractSemanticFeatures(content: string): Promise<{
    clusterId: number;
    density: number;
    conceptTags: string[];
  }>;
}
