import { MemoryStage } from ".";

export interface MemoryStatistics {
  readonly agentId: string;
  readonly totalEpisodes: number;
  readonly byStage: Record<MemoryStage, number>;
  readonly featureDistribution: {
    readonly environments: Record<string, number>;
    readonly taskTypes: Record<string, number>;
    readonly avgRecencyScore: number;
    readonly avgImportance: number;
  };
  readonly utilizationMetrics: {
    readonly avgRetrievalSuccess: number;
    readonly totalAccesses: number;
    readonly hotClusters: number[]; // semantic cluster IDs
    readonly coldEpisodes: string[]; // episode IDs
  };
  readonly consolidationHealth: {
    readonly episodesReadyForConsolidation: number;
    readonly overConsolidatedEpisodes: number;
    readonly balanceScore: number; // stability-plasticity balance
  };
}
