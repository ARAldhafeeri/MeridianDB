/**
 * core design of MeridianDB software development kit
 * it will be used by developers to interact with
 * the database over REST.
 * each request need to reauthenticate itself and request
 * refresh-token via the access token.
 * should be refactored out as stand-alone library  in the future
 */

import {
  AgentFilter,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "../../server/entities/domain/agent";
import { MemoryStatistics } from "../../server/entities/domain/analytics";
import {
  AuditFeedbackRequest,
  BehavioralDecisionNode,
  MemoryBehavioralFeedback,
  StoreBehavioralFeedbackRequest,
  UpdateDecisionTreeRequest,
} from "../../server/entities/domain/behavioral";
import { ConsolidationRequest } from "../../server/entities/domain/dto";
import {
  MemoryRetrievalRequest,
  MemoryRetrievalResult,
  StoreEpisodeRequest,
} from "../../server/entities/domain/memory";
import { ConsolidationResult } from "../../server/entities/domain/responses";
import { MemoryEpisode } from "../../server/entities/domain/vector";
import {
  ServiceContext,
  ServiceResult,
} from "../../server/entities/interfaces/services/base";

/**
 * sdk config parameters
 */
interface MeridianDBClientConfig {
  // access token for authentication and authorization
  // it holds agentId and organizationId
  accessToken: string;
}

/**
 * this should replicate agent, behavior tracking, memory operation, authentication
 * services to allow
 */
interface MerdianDBClient {
  // Agent
  // create new agent
  create(data: CreateAgentRequest): Promise<Response>;
  // get agent by id
  getById(id: string): Promise<Response>;
  // list agents
  list(data: AgentFilter): Promise<Response>;
  // update agent
  update(data: UpdateAgentRequest): Promise<Response>;
  // delete agent
  delete(id: string): Promise<Response>;
  // intialize agent

  // Agent Memory Management
  // Core operations
  storeEpisode(
    data: StoreEpisodeRequest
  ): Promise<ServiceResult<MemoryEpisode>>;
  retrieveMemories(
    data: MemoryRetrievalRequest
  ): Promise<ServiceResult<MemoryRetrievalResult>>;

  // Consolidation
  consolidateMemories(
    data: ConsolidationRequest
  ): Promise<ServiceResult<ConsolidationResult>>;

  // Analytics
  getStatistics(agentId: string): Promise<ServiceResult<MemoryStatistics>>;

  // Cross-agent sharing
  shareKnowledge(
    sourceAgentId: string,
    targetAgentId: string
  ): Promise<ServiceResult<number>>;

  // Auth
  /**
   * get refresh token based on access token which is linked
   * to agent and/or organization
   */
  getToken(token: string): Promise<Response>;

  // Behavior  Tracking and agent feedback
  // Core feedback operations
  recordFeedback(
    request: StoreBehavioralFeedbackRequest
  ): Promise<ServiceResult<MemoryBehavioralFeedback>>;

  getFeedbackHistory(
    memoryEpisodeId: string,
    agentId: string
  ): Promise<ServiceResult<MemoryBehavioralFeedback[]>>;

  // Decision tree management
  updateDecisionTree(
    data: UpdateDecisionTreeRequest
  ): Promise<ServiceResult<BehavioralDecisionNode>>;

  getDecisionPatterns(
    agentId: string,
    taskType?: string,
    environment?: string
  ): Promise<ServiceResult<BehavioralDecisionNode[]>>;

  // Human audit workflow
  submitAudit(
    data: AuditFeedbackRequest
  ): Promise<ServiceResult<MemoryBehavioralFeedback>>;
}
