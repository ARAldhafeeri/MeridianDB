import { BaseService, ServiceContext, ServiceResult } from "./base";
import {
  Agent,
  AgentFilter,
  AgentInitializationResult,
  AgentMetrics,
  AgentStatus,
  CreateAgentRequest,
  LearningConfiguration,
  UpdateAgentRequest,
} from "../../domain/agent";

/**
 * Service for managing AI agents and their lifecycle
 */
export interface AgentService
  extends BaseService<
    Agent,
    CreateAgentRequest,
    UpdateAgentRequest,
    AgentFilter
  > {
  /**
   * Initialize agent with default memory structures
   */
  initialize(
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<AgentInitializationResult>>;

  /**
   * Configure agent learning parameters
   */
  configureLearning(
    agentId: string,
    config: LearningConfiguration,
    context: ServiceContext
  ): Promise<ServiceResult<Agent>>;

  /**
   * Get agent performance metrics
   */
  getPerformanceMetrics(
    agentId: string,
    timeWindow: number,
    context: ServiceContext
  ): Promise<ServiceResult<AgentMetrics>>;

  /**
   * Activate/deactivate agent
   */
  setActiveStatus(
    agentId: string,
    isActive: boolean,
    context: ServiceContext
  ): Promise<ServiceResult<Agent>>;

  /**
   * Clone agent with knowledge transfer
   */
  clone(
    sourceAgentId: string,
    targetName: string,
    context: ServiceContext
  ): Promise<ServiceResult<Agent>>;

  /**
   * Get agent capabilities and current status
   */
  getStatus(
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<AgentStatus>>;

  /**
   * Update agent capabilities
   */
  updateCapabilities(
    agentId: string,
    capabilities: string[],
    context: ServiceContext
  ): Promise<ServiceResult<Agent>>;
}
