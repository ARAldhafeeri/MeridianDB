import { BaseService, ServiceContext, ServiceResult } from "./base";
import {
  Agent,
  AgentFilter,
  CreateAgentRequest,
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

  }
