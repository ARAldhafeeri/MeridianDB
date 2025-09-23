import { Agent, AgentFilter } from "@meridiandb/shared/src/entities/agent";
import { BaseControllerImpl } from "./base";
import { AgentService } from "@/services/agent";

export class AgentController extends BaseControllerImpl<Agent, AgentFilter> {
  constructor(service: AgentService) {
    super(service);
  }
}
