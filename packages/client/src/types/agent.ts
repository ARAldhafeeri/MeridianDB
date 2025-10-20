export interface Agent {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  stabilityThreshold: number;
  successRate: number;
  createdAt: Date;
  updatedAt: Date;
  ORG_ID?: string;
  AGENT_ID?: string;
}

export interface CreateAgentRequest {
  name: string;
  email: string;
  isActive: boolean;
  stabilityThreshold: number;
  successRate: number;
  ORG_ID: string;
}

export interface UpdateAgentRequest {
  name?: string;
  email?: string;
  isActive?: boolean;
  stabilityThreshold?: number;
  successRate?: number;
}

export interface AgentFilter {
  search?: string;
  isActive?: boolean;
  minStabilityThreshold?: number;
  minSuccessRate?: number;
  page?: number;
  pageSize?: number;
}
