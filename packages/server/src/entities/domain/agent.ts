export type {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  AgentFilter,
} from "@meridiandb/shared/src/entities/agent";

/**
 * Part of the payload for the agent refresh token.
 * setted in authorization middleware as request context.
 * used in retreival and insertion.
 */
export interface AgentRequestContext {
  organizationId: string;
  agentId: string;

  /**
   * Temporal
   * protecting consolidated knowledge with thruhold
   * related to temporal and archieving it's a decay factor 0-1
   */
  readonly stabilityThreshold: number;

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
}
