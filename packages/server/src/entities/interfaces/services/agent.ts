import { BaseService } from "./base";
import { Agent, AgentFilter } from "../../domain/agent";

/**
 * Service for managing AI agents and their lifecycle
 */
export interface AgentService extends BaseService<Agent, AgentFilter> {}
