import { BaseEntity } from "./base";

type IDecayCurve = "exponential" | "hybird" | "polynomial";

/**
 * Agent Config features
 */

export interface AgentMemoriesFeaturesConfig {
  /**
   * Temporal
   * protecting consolidated knowledge with thruhold
   * related to temporal and archieving it's a decay factor 0-1
   */
  readonly stabilityThreshold: number;
  /**
   * Temporal Features configuration
   */
  readonly halfLifeHours: number;
  readonly timeWeight: number;
  readonly frequencyWeight: number;
  readonly decayCurve: IDecayCurve;

  /***
   * Behavioral
   * Success rate , memories surpass success rate
   * will not be included within the results
   */
  readonly successRate: number;

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
 * AI Agent entity
 */
export interface Agent extends BaseEntity, AgentMemoriesFeaturesConfig {
  /**
   * The id of the organization the ai agent is linked to
   * must be created before the agent is created. Used in multi
   * tenancy and federated access control
   */
  organizationId: string;
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
   * access token
   */
  accessToken: string;
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
  readonly metadata?: Record<string, unknown>;
}

/**
 * agent filter query parameters
 */
export interface AgentFilter {
  readonly organizationId?: string;
  readonly name?: string;
  readonly isActive?: boolean;
  readonly capabilities?: string[];
  readonly createdAfter?: Date;
  readonly createdBefore?: Date;
}
