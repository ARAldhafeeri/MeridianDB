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
