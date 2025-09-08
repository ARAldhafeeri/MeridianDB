import { ConsolidationStage } from ".";
import { TimeSeriesData } from "./analytics";
import { BaseEntity } from "./base";

/**
 * AI Agent entity
 */
export interface Agent extends BaseEntity {
  /**
   * The id of the organization the ai agent is linked to
   * must be created before the agent is created. Used in multi
   * tenancy and federated access control
   */
  readonly organizationId: string;
  /**
   * simple name for operators and admins to identify the agent with
   */
  readonly name: string;
  /**
   * Clear description of the agent
   */
  readonly description?: string;
  /**
   * What the agent is soupose to do.
   * Can be described as word or full sentances.
   */
  readonly capabilities: string[];
  /**
   * A number to configure the learning rate of the ai agent
   * high number means the ai agent will learn fast
   * low number will mean the ai agent will learn slow
   * this will control the rate at which vectors are stored
   * and their amount to strike good balance between
   * palsticity and stability
   */
  readonly learningRate: number;
  /**
   * protecting consolidated knowledge with thruhold
   * related to temporal and archieving.
   */
  readonly stabilityThreshold: number;
  /**
   * allow the admin from the admin portal to enable
   * or disable the agent.
   */
  readonly isActive: boolean;
  /**
   * metadata of the ai agent.
   */
  readonly metadata: Record<string, unknown>;
}

/**
 * create agent payload
 */
export interface CreateAgentRequest {
  readonly name: string;
  readonly description?: string;
  readonly capabilities: string[];
  readonly learningRate?: number;
  readonly stabilityThreshold?: number;
  readonly contextWindow?: number;
  readonly metadata?: Record<string, unknown>;
}

/**
 * update agent payload
 */
export interface UpdateAgentRequest {
  readonly name?: string;
  readonly description?: string;
  readonly capabilities?: string[];
  readonly learningRate?: number;
  readonly stabilityThreshold?: number;
  readonly contextWindow?: number;
  readonly metadata?: Record<string, unknown>;
}

/**
 * agent filter query parameters
 */
export interface AgentFilter {
  readonly name?: string;
  readonly isActive?: boolean;
  readonly capabilities?: string[];
  readonly createdAfter?: Date;
  readonly createdBefore?: Date;
}

/**
 * Agent learning configuration
 */
export interface LearningConfiguration {
  /**
   * the rate at which the ai agent learns at
   */
  readonly learningRate: number;
  /**
   * protecting old memories with threshold
   * passing the threshold means older memories
   * will be archieved
   */
  readonly stabilityThreshold: number;
  /**
   * the threshold at which the agent will
   * stop receiving new memories.
   */
  readonly plasticityThreshold: number;
  /**
   * the rate at which the agent forget information
   * not sure how we calculate this but it could be
   * a number editable by the admin in the dashboard
   * or via feedback from users that use the agent
   */
  readonly forgettingRate: number;
}

/**
 * intialize agent request.
 */
export interface AgentInitializationResult {
  readonly agentId: string;
  readonly rootNodeId: string;
  readonly contextVectorId: string;
  readonly initialCapabilities: string[];
}

/**
 * agent metrices
 */
export interface AgentMetrics {
  readonly agentId: string;
  readonly learningEfficiency: number;
  readonly knowledgeRetention: number;
  readonly adaptabilityScore: number;
  readonly memoryUtilization: MemoryUtilization;
  readonly performanceTrends: TimeSeriesData[];
}

/**
 * agent memory utilization
 */
export interface MemoryUtilization {
  readonly totalNodes: number;
  readonly totalVectors: number;
  readonly episodicMemory: number;
  readonly consolidatedMemory: number;
  readonly storageBytes: number;
}

/**
 * The status of the agent
 */
export interface AgentStatus {
  readonly agentId: string;
  readonly isActive: boolean;
  readonly currentTask?: string;
  readonly learningStage: ConsolidationStage;
  readonly lastActivity: Date;
  readonly memoryPressure: number; // 0-1 scale
  readonly consolidationQueue: number;
  readonly errorRate: number;
  readonly capabilities: string[];
}
