import type { BaseEntity } from "./base";
export type { MemoryBehavioralFeedback } from "@meridiandb/shared/src/entities/behavioral";

/**
 * Decision tree node for behavioral retrieval
 */
export interface BehavioralDecisionNode extends BaseEntity {
  readonly agentId: string;
  readonly organizationId: string;

  // Decision context
  readonly contextSignature: string; // hash of task+environment+goal
  readonly taskType: string;
  readonly environment: string;
  readonly goalCategory?: string;

  // Decision outcomes
  readonly successfulMemoryIds: string[]; // memories that led to success
  readonly failedMemoryIds: string[]; // memories that led to failure
  readonly avgSuccessRate: number; // 0-1
  readonly totalDecisions: number;

  // Learning signals
  readonly confidencePattern: number[]; // confidence levels over time
  readonly diversityInjectionNeeded: boolean; // avoid tunnel vision

  readonly lastUpdatedAt: Date;
}

// Request types
export interface StoreBehavioralFeedbackRequest {
  readonly memoryEpisodeId: string;
  readonly agentId: string;
  readonly taskType: string;
  readonly environment: string;
  readonly effectiveness: number;
  readonly relevance: number;
  readonly accuracy: number;
  readonly taskSuccess: boolean;
  readonly memoryContribution: "positive" | "negative" | "neutral";
  readonly confidence: number;
  readonly feedbackSource: "agent" | "human" | "system";
  readonly taskId?: string;
  readonly goalCategory?: string;
}

export interface UpdateDecisionTreeRequest {
  readonly agentId: string;
  readonly taskType: string;
  readonly environment: string;
  readonly goalCategory?: string;
  readonly memoryId: string;
  readonly outcome: "success" | "failure";
  readonly confidence: number;
}

export interface BehavioralAnalyticsRequest {
  readonly agentId: string;
  readonly taskType?: string;
  readonly environment?: string;
  readonly timeRangeStart?: Date;
  readonly timeRangeEnd?: Date;
}

export interface RiskAssessmentRequest {
  readonly agentId: string;
  readonly taskType: string;
  readonly environment: string;
  readonly memoryIds: string[];
}

export interface AuditFeedbackRequest {
  readonly feedbackId: string;
  readonly auditorId: string;
  readonly auditScore: number;
  readonly auditNotes?: string;
  readonly correctedEffectiveness?: number;
  readonly correctedRelevance?: number;
}

export interface OptimizeWeightsRequest {
  readonly agentId: string;
  readonly taskType?: string;
  readonly environment?: string;
  readonly optimizationGoal: "accuracy" | "efficiency" | "diversity";
  readonly minSampleSize: number;
}

export interface RiskAssessment {
  readonly overallRisk: "low" | "medium" | "high";
  readonly riskFactors: {
    readonly tunnelVision: number; // 0-1
    readonly overConfidence: number;
    readonly staleness: number;
    readonly contextMismatch: number;
  };
  readonly recommendations: string[];
  readonly memoryRiskScores: Array<{
    readonly memoryId: string;
    readonly riskScore: number;
    readonly riskReasons: string[];
  }>;
}

// Filter and query types
export interface BehavioralFilter {
  readonly agentId?: string;
  readonly organizationId?: string;
  readonly memoryEpisodeId?: string;
  readonly taskType?: string;
  readonly environment?: string;
  readonly feedbackSource?: "agent" | "human" | "system";
  readonly humanAudited?: boolean;
  readonly minEffectiveness?: number;
  readonly maxAge?: number;
  readonly limit?: number;
  readonly offset?: number;
}
