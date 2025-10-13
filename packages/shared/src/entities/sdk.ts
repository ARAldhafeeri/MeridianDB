/**
 * core design of MeridianDB software development kit
 * it will be used by developers to interact with
 * the database over REST.
 * each request need to reauthenticate itself and request
 * refresh-token via the access token.
 * should be refactored out as stand-alone library  in the future
 */

// import { AgentFilter, CreateAgentRequest, UpdateAgentRequest } from "./agent";

import {
  CreateMemoryEpisodeRequest,
  MemoryBehavioralUpdate,
  MemoryEpisode,
  MemoryRetrievalRequest,
} from "./memory";

import { ServiceResult } from "./base";
/**
 * sdk config parameters
 */
export interface MeridianDBClientConfig {
  /**
   * Access token used in refresh token flow, holds some
   * context about the agent, note the refresh token
   * functionality is set to handle store, retreive memories only
   * you can't hit the admin endpoints with this
   * use admin credentials flow.
   */
  accessToken: string;
  /**
   * URL of meridianDB backend
   */
  url: string;
}

/**
 * this should replicate agent, behavior tracking, memory operation, authentication
 * services to allow
 */
export interface IMerdianDBClient {
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
  storeMemory(
    data: CreateMemoryEpisodeRequest
  ): Promise<ServiceResult<MemoryEpisode>>;
  /**
   * Reterive memory for single agent
   * @param data search query
   */
  retrieveMemoriesSingleAgent(
    data: MemoryRetrievalRequest
  ): Promise<ServiceResult<MemoryRetrievalRequest>>;

  /**
   * Reterive memory for multi agent
   * @param data search query
   */
  retrieveMemoriesMultieAgent(
    data: MemoryRetrievalRequest
  ): Promise<ServiceResult<MemoryRetrievalRequest>>;
  // Behavior  Tracking and agent feedback
  // Core feedback operations
  recordFeedback(payload: MemoryBehavioralUpdate): Promise<boolean>;
}
