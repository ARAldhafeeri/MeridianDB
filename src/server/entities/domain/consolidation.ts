import { ConsolidationMetrics } from "./responses";

/**
 * cron job configuration for memory conslidation
 */
export interface ConsolidationSchedule {
  readonly frequency: number; // minutes
  readonly importanceThreshold: number;
  readonly batchSize: number;
  readonly maxDuration: number; // minutes
  readonly enabled: boolean;
}

/**
 * status of conslidation job
 */
export interface ConsolidationStatus {
  readonly agentId: string;
  readonly isRunning: boolean;
  readonly queueSize: number;
  readonly lastRun?: Date;
  readonly nextRun?: Date;
  readonly currentStage?: string;
  readonly progress: number; // 0-1
  readonly estimatedCompletion?: Date;
}

export interface ReplayRequest {
  readonly agentId: string;
  readonly memoryIds: string[];
  readonly replayStrategy: "sequential" | "interleaved" | "importance_weighted";
  readonly contextEnrichment?: boolean;
  readonly generateSynthetic?: boolean;
}

/**
 * Reply result of conslidation
 */
export interface ReplayResult {
  readonly replayedCount: number;
  readonly strengthenedConnections: number;
  readonly newInsights: string[];
  readonly processingTime: number;
}

/**
 * Metrices how fast the agentic ai learns , how stable
 */
export interface StabilityPlasticityMetrics {
  readonly agentId: string;
  readonly stabilityScore: number; // 0-1
  readonly plasticityScore: number; // 0-1
  readonly balance: number; // -1 to 1, 0 is perfect balance
  readonly recommendations: string[];
  readonly riskFactors: string[];
}

/**
 * parameters to configure agent memory consolidation
 */
export interface ConsolidationParameters {
  readonly learningRate: number;
  readonly regularizationStrength: number;
  readonly replayProbability: number;
  readonly forgettingRate: number;
  readonly importanceThreshold: number;
  readonly batchSize: number;
}

/**
 * logs of conslidation
 */
export interface ConsolidationHistory {
  readonly timestamp: Date;
  readonly episodesProcessed: number;
  readonly duration: number;
  readonly metrics: ConsolidationMetrics;
  readonly parametersUsed: ConsolidationParameters;
}

/**
 * result of prevention of memory conslidation
 */
export interface PreventionResult {
  readonly riskAssessment: number; // 0-1, 1 is high risk
  readonly protectedMemories: string[];
  readonly mitigationStrategies: string[];
  readonly success: boolean;
}
