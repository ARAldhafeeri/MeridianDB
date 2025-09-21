import { Agent, AgentFilter } from "@meridiandb/shared/src/entities/agent";
import { BaseServiceImpl } from "./base";
import { AgentRepository } from "@/repositories/agent";

export class AgentService extends BaseServiceImpl<Agent, AgentFilter> {
  constructor(agentRepository: AgentRepository) {
    super(agentRepository);
  }
}
