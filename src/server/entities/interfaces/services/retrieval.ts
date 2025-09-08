import { AdvancedSearchRequest } from "../../domain/dto";
import { SearchResult } from "../../domain/responses";
import {
  CompensatedSearchRequest,
  ExplanationResult,
  FederatedSearchRequest,
  FederatedSearchResult,
  GraphRAGRequest,
  GraphRAGResult,
  QueryAnalytics,
  RetrievalFeedback,
  RetrievalOptimization,
  RetrievalRecommendations,
} from "../../domain/retrieval";
import { ServiceContext, ServiceResult } from "./base";

/**
 * Service for advanced knowledge retrieval and ranking
 * Implements multi-dimensional similarity and contextual search
 */
export interface RetrievalService {
  /**
   * Perform advanced multi-dimensional search
   */
  advancedSearch(
    request: AdvancedSearchRequest,
    context: ServiceContext
  ): Promise<ServiceResult<SearchResult[]>>;

  /**
   * GraphRAG-based contextual retrieval
   */
  graphRAGSearch(
    request: GraphRAGRequest,
    context: ServiceContext
  ): Promise<ServiceResult<GraphRAGResult>>;

  /**
   * Contextual drift compensation during retrieval
   */
  compensatedSearch(
    request: CompensatedSearchRequest,
    context: ServiceContext
  ): Promise<ServiceResult<SearchResult[]>>;

  /**
   * Get retrieval recommendations based on agent behavior
   */
  getRetrievalRecommendations(
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<RetrievalRecommendations>>;

  /**
   * Explain retrieval results with reasoning
   */
  explainResults(
    results: SearchResult[],
    query: string,
    context: ServiceContext
  ): Promise<ServiceResult<ExplanationResult>>;

  /**
   * Optimize retrieval parameters for an agent
   */
  optimizeRetrieval(
    agentId: string,
    feedbackData: RetrievalFeedback[],
    context: ServiceContext
  ): Promise<ServiceResult<RetrievalOptimization>>;

  /**
   * Cross-agent knowledge retrieval with federation
   */
  federatedSearch(
    request: FederatedSearchRequest,
    context: ServiceContext
  ): Promise<ServiceResult<FederatedSearchResult>>;

  /**
   * Real-time query performance analytics
   */
  getQueryAnalytics(
    agentId: string,
    timeWindow: number,
    context: ServiceContext
  ): Promise<ServiceResult<QueryAnalytics>>;
}
