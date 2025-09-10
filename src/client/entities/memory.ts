import { BaseComponentProps } from "./base";

export interface MemorySearchProps extends BaseComponentProps {
  readonly agentId: string;
  readonly onSearch: (query: string, filters?: any) => void;
  readonly filters: {
    readonly environment?: string;
    readonly taskType?: string;
    readonly timeRange?: [Date, Date];
  };
}

export interface MemoryCardProps extends BaseComponentProps {
  readonly memory: {
    readonly id: string;
    readonly content: string;
    readonly environment: string;
    readonly task: string;
    readonly recencyScore: number;
    readonly accessFrequency: number;
    readonly createdAt: Date;
  };
  readonly score?: {
    readonly composite: number;
    readonly breakdown: {
      readonly semantic: number;
      readonly temporal: number;
      readonly contextual: number;
      readonly behavioral: number;
    };
  };
}

export interface MemoryStatsProps extends BaseComponentProps {
  readonly stats: {
    readonly totalEpisodes: number;
    readonly byStage: Record<string, number>;
    readonly avgRecencyScore: number;
    readonly totalAccesses: number;
    readonly consolidationHealth: number;
  };
}
