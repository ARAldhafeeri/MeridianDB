/**
 * anlaytics event published and stored
 */
export interface AnalyticsEvent {
  /**
   * type of the anlaytic event
   */
  readonly type: AnlayticEventType;
  /**
   * identification fields
   */
  readonly organizationId: string;
  readonly agentId?: string;
  /**
   * vector-graph fields
   */
  readonly nodeId?: string;
  readonly vectorId?: string;
  /**
   * others such timestap
   */
  readonly timestamp: Date;
}

export type AnlayticEventType =
  | "query"
  | "update"
  | "consolidation"
  | "access"
  | "error";

export interface MetricsRequest {
  readonly organizationId: string;
  readonly agentId?: string;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly granularity: "minute" | "hour" | "day";
  readonly metrics: string[];
}

export interface MetricsResponse {
  readonly data: Record<string, TimeSeriesData[]>;
  readonly aggregated: Record<string, number>;
}

export interface TimeSeriesData {
  readonly timestamp: Date;
  readonly value: number;
}

/**
 * metrics to measure the impact of new learned data on old tasks
 */
export interface BWTMetrics {
  readonly agentId: string;
  readonly overallBWT: number;
  readonly taskBWT: Record<string, number>;
  readonly timeDecay: number;
  readonly stabilityScore: number;
}

/**
 * Metrics to measure the decay rates of knowledge
 */
export interface ForgettingCurve {
  readonly nodeId: string;
  readonly dataPoints: Array<{ time: number; retention: number }>;
  readonly decayRate: number;
  readonly halfLife: number;
}

/**
 * Metrics to measure the cross agent learning
 */
export interface TransferMetrics {
  readonly sourceAgentId: string;
  readonly targetAgentId: string;
  readonly transferSuccess: number;
  readonly knowledgeGain: number;
  readonly adaptationTime: number;
}

/**
 * System-wide metrics
 */
export interface SystemMetrics {
  readonly queryLatency: LatencyMetrics;
  readonly storageUtilization: StorageMetrics;
  readonly errorRates: Record<string, number>;
  readonly concurrentUsers: number;
  readonly throughput: number;
}

export interface LatencyMetrics {
  readonly p50: number;
  readonly p95: number;
  readonly p99: number;
  readonly avg: number;
}

export interface StorageMetrics {
  readonly d1Usage: number;
  readonly vectorizeUsage: number;
  readonly kvUsage: number;
  readonly r2Usage: number;
}

export interface DashboardConfig {
  readonly name: string;
  readonly widgets: DashboardWidget[];
  readonly refreshInterval: number;
  readonly timeRange: string;
}

export interface DashboardWidget {
  readonly type: "chart" | "metric" | "table";
  readonly title: string;
  readonly query: string;
  readonly config: Record<string, unknown>;
}

export interface Dashboard {
  readonly id: string;
  readonly organizationId: string;
  readonly config: DashboardConfig;
  readonly createdAt: Date;
}

export interface BitmapResult {
  readonly count: number;
  readonly bitmap: string; // base64 encoded bitmap
  readonly cardinality: number;
}
