import {
  AnalyticsEvent,
  BWTMetrics,
  BitmapResult,
  Dashboard,
  DashboardConfig,
  ForgettingCurve,
  MetricsRequest,
  MetricsResponse,
  SystemMetrics,
  TransferMetrics,
} from "../../domain/analytics";

/**
 * Repository for analytics using KV with bitmap implementation
 * Tracks system metrics, usage patterns, and learning analytics
 */
export interface AnalyticsRepository {
  /**
   * Record event with bitmap-based counting
   */
  recordEvent(event: AnalyticsEvent): Promise<void>;

  /**
   * Batch record multiple events
   */
  recordEvents(events: AnalyticsEvent[]): Promise<void>;

  /**
   * Get aggregated metrics for time period
   */
  getMetrics(request: MetricsRequest): Promise<MetricsResponse>;

  /**
   * Calculate backward transfer (BWT) scores
   */
  calculateBWT(agentId: string, timeWindow: number): Promise<BWTMetrics>;

  /**
   * Track forgetting curves
   */
  getForgettingCurves(
    agentId: string,
    nodeIds: string[]
  ): Promise<ForgettingCurve[]>;

  /**
   * Measure transfer efficiency between agents
   */
  getTransferEfficiency(
    sourceAgentId: string,
    targetAgentId: string
  ): Promise<TransferMetrics>;

  /**
   * Get system performance metrics
   */
  getSystemMetrics(timeWindow: number): Promise<SystemMetrics>;

  /**
   * Create custom analytics dashboard
   */
  createDashboard(
    organizationId: string,
    config: DashboardConfig
  ): Promise<Dashboard>;

  /**
   * Query bitmap-based counters
   */
  queryBitmaps(
    organizationId: string,
    keys: string[],
    operation: "AND" | "OR" | "XOR"
  ): Promise<BitmapResult>;
}
