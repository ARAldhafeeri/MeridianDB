import { AccessLevel, SimilarityType } from ".";
import { TimeSeriesData } from "./analytics";
import { GraphNode } from "./graph";
import { GraphPath } from "../interfaces/repositories/graph";
import { SearchResult } from "./responses";

/**
 * GraphRag request from the AI agent
 */
export interface GraphRAGRequest {
  readonly query: string;
  readonly agentId: string;
  readonly startNodes?: string[];
  readonly maxHops: number;
  readonly pathWeighting: "uniform" | "importance" | "recency";
  readonly includeContext?: boolean;
  readonly synthesizeResponse?: boolean;
}

/**
 * GraphRag response based on the AI agent request
 */
export interface GraphRAGResult {
  readonly response: string;
  readonly sourceNodes: GraphNode[];
  readonly traversalPaths: GraphPath[];
  readonly confidence: number;
  readonly synthesisSteps: string[];
}

/**
 * Search request with the ai agent type of memory.
 */
export interface CompensatedSearchRequest {
  readonly query: string | number[];
  readonly agentId: string;
  readonly compensationStrategy: "temporal" | "contextual" | "adaptive";
  readonly driftThreshold: number;
  readonly limit: number;
}

/**
 * Overall retrievalRecommendations
 */
export interface RetrievalRecommendations {
  readonly agentId: string;
  readonly suggestedQueries: string[];
  readonly relatedConcepts: string[];
  readonly knowledgeGaps: string[];
  readonly explorationTargets: string[];
}

/**
 * Explanantion result of retrieval ( ranking )
 */
export interface ExplanationResult {
  readonly queryAnalysis: string;
  readonly rankingFactors: Array<{
    factor: string;
    weight: number;
    explanation: string;
  }>;
  readonly resultExplanations: Array<{ resultId: string; reasoning: string[] }>;
  readonly alternativeQueries: string[];
}

/**
 * Retrieval feedback
 */
export interface RetrievalFeedback {
  readonly queryId: string;
  readonly resultId: string;
  readonly relevance: number; // 0-1
  readonly usefulness: number; // 0-1
  readonly accuracy: number; // 0-1
  readonly timestamp: Date;
}

/**
 * Optimization for future retrieval.
 */
export interface RetrievalOptimization {
  readonly agentId: string;
  readonly optimizedWeights: Record<SimilarityType, number>;
  readonly recommendedThresholds: Record<string, number>;
  readonly performanceGain: number;
  readonly confidenceScore: number;
}

/**
 * search request across orgs, agents
 */
export interface FederatedSearchRequest {
  readonly query: string;
  readonly organizationId: string;
  readonly targetOrganizations?: string[];
  readonly accessLevel: AccessLevel;
  readonly maxResults: number;
  readonly includeExternalSources?: boolean;
}

/**
 * search result across orgs, agents
 */
export interface FederatedSearchResult {
  readonly results: SearchResult[];
  readonly sourceBreakdown: Record<string, number>;
  readonly federationLatency: number;
  readonly accessGranted: boolean;
  readonly trustScore: number;
}

/**
 * Agent query anlaytics.
 */
export interface QueryAnalytics {
  readonly agentId: string;
  readonly totalQueries: number;
  readonly avgLatency: number;
  readonly successRate: number;
  readonly topQueries: Array<{ query: string; count: number }>;
  readonly performanceTrends: TimeSeriesData[];
}
