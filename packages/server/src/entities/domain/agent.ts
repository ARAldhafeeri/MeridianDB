export type { Agent } from "@meridiandb/shared/src/entities/agent";

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
