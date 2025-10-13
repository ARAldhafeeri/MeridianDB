/**
 * core design of MeridianDB software development kit
 * it will be used by developers to interact with
 * the database over REST.
 * each request need to reauthenticate itself and request
 * refresh-token via the access token.
 * should be refactored out as stand-alone library  in the future
 */

import { AgentFilter, CreateAgentRequest, UpdateAgentRequest } from "./agent";

import { MemoryEpisode, MemoryRetrievalRequest } from "./memory";

import { ServiceResult } from "./base";
/**
 * sdk config parameters
 */
export interface MeridianDBClientConfig {
  // access token for authentication and authorization
  // it holds agentId and organizationId
  accessToken: string;
}

/**
 * this should replicate agent, behavior tracking, memory operation, authentication
 * services to allow
 */
export interface MerdianDBClient {
  // TODO rbac for agents, admins
  // // Agent
  // // create new agent
  // create(data: CreateAgentRequest): Promise<Response>;
  // // get agent by id
  // getById(id: string): Promise<Response>;
  // // list agents
  // list(data: AgentFilter): Promise<Response>;
  // // update agent
  // update(data: UpdateAgentRequest): Promise<Response>;
  // // delete agent
  // delete(id: string): Promise<Response>;
  // // intialize agent

  // Agent Memory Management
  // Core operations
  storeEpisode(data: MemoryEpisode): Promise<ServiceResult<MemoryEpisode>>;
  retrieveMemories(
    data: MemoryRetrievalRequest
  ): Promise<ServiceResult<MemoryRetrievalRequest>>;

  // Auth
  /**
   * get refresh token based on access token which is linked
   * to agent and/or organization
   */
  getToken(token: string): Promise<Response>;

  // Behavior  Tracking and agent feedback
  // Core feedback operations
  recordFeedback(success: boolean): Promise<ServiceResult<void>>;
}
