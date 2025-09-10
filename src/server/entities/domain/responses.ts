import { VectorEmbedding } from "./vector";

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly timestamp: Date;
  readonly requestId: string;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/**
 * Consolidation result with metrics
 */
export interface ConsolidationResult {
  readonly agentId: string;
  readonly episodesProcessed: number;
  readonly nodesCreated: number;
  readonly edgesCreated: number;
  readonly vectorsUpdated: number;
  readonly memoryFreed: number; // bytes
  readonly processingTime: number; // milliseconds
  readonly metrics: ConsolidationMetrics;
}

export interface ConsolidationMetrics {
  readonly backwardTransfer: number; // BWT score
  readonly forgettingRate: number;
  readonly transferEfficiency: number;
  readonly stabilityRatio: number;
  readonly plasticityRatio: number;
}
