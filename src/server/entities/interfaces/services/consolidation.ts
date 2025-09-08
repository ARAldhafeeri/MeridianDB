import {
  ConsolidationHistory,
  ConsolidationParameters,
  ConsolidationSchedule,
  ConsolidationStatus,
  PreventionResult,
  ReplayRequest,
  ReplayResult,
  StabilityPlasticityMetrics,
} from "../../domain/consolidation";
import { ConsolidationRequest } from "../../domain/dto";
import { ConsolidationResult } from "../../domain/responses";
import { ServiceContext, ServiceResult } from "./base";

/**
 * Service for memory consolidation and stability-plasticity balance
 * Implements the core CLS-inspired consolidation mechanism
 */
export interface ConsolidationService {
  /**
   * Trigger consolidation process for an agent
   */
  consolidate(
    request: ConsolidationRequest,
    context: ServiceContext
  ): Promise<ServiceResult<ConsolidationResult>>;

  /**
   * Schedule periodic consolidation
   */
  scheduleConsolidation(
    agentId: string,
    schedule: ConsolidationSchedule,
    context: ServiceContext
  ): Promise<ServiceResult<string>>;

  /**
   * Get consolidation status and queue
   */
  getConsolidationStatus(
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<ConsolidationStatus>>;

  /**
   * Replay specific memories for targeted consolidation
   */
  replayMemories(
    request: ReplayRequest,
    context: ServiceContext
  ): Promise<ServiceResult<ReplayResult>>;

  /**
   * Calculate stability-plasticity balance
   */
  calculateBalance(
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<StabilityPlasticityMetrics>>;

  /**
   * Adjust consolidation parameters based on performance
   */
  optimizeParameters(
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<ConsolidationParameters>>;

  /**
   * Get consolidation history and analytics
   */
  getConsolidationHistory(
    agentId: string,
    limit: number,
    context: ServiceContext
  ): Promise<ServiceResult<ConsolidationHistory[]>>;

  /**
   * Handle catastrophic forgetting prevention
   */
  preventCatastrophicForgetting(
    agentId: string,
    newTaskContext: string,
    context: ServiceContext
  ): Promise<ServiceResult<PreventionResult>>;
}
