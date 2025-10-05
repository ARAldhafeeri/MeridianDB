import { Agent, AgentFilter } from "@meridiandb/shared/src/entities/agent";
import { BaseServiceImpl } from "./base";
import { AgentRepository } from "@/repositories/agent";
import { generateAccessToken } from "@/utils/access";
import { getOrgId } from "@/config/context";

export class AgentService extends BaseServiceImpl<Agent, AgentFilter> {
  constructor(private agentRepository: AgentRepository) {
    super(agentRepository);
  }

  async create(request: Agent): Promise<Agent> {
    // generate and add accessToekn
    request.accessToken = generateAccessToken();
    /**
     *
     * orgId is assigned to the token upon user sign in.
     * reassigning such field is a must
     * hackers can create entities in other organizations
     * by changing such field.
     */
    request.organizationId = getOrgId();

    return super.create(request);
  }

  async getByAccessToken(accessToken: string): Promise<Agent> {
    const entity = await this.agentRepository.findOne({
      accessToken: accessToken,
    });
    if (!entity) {
      throw new Error(`Entity with id ${accessToken} not found`);
    }
    return entity;
  }
}
