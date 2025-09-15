import { BaseEntity } from "../../domain/base";
import { PaginatedResponse } from "../../domain/dto";
import {
  MemoryBehavioralFeedback,
  BehavioralDecisionNode,
  BehavioralFilter,
} from "../../domain/behavioral";

export interface BehavioralRepository {
  // Feedback CRUD
  storeFeedback(
    feedback: Omit<MemoryBehavioralFeedback, keyof BaseEntity>
  ): Promise<MemoryBehavioralFeedback>;

  findFeedback(
    id: string,
    organizationId?: string
  ): Promise<MemoryBehavioralFeedback | null>;

  findFeedbackByMemory(
    memoryEpisodeId: string,
    agentId: string
  ): Promise<MemoryBehavioralFeedback[]>;

  findFeedbacks(
    filter: BehavioralFilter
  ): Promise<PaginatedResponse<MemoryBehavioralFeedback>>;

  updateFeedback(
    id: string,
    updates: Partial<MemoryBehavioralFeedback>
  ): Promise<MemoryBehavioralFeedback>;

  // Decision tree CRUD
  storeDecisionNode(
    node: Omit<BehavioralDecisionNode, keyof BaseEntity>
  ): Promise<BehavioralDecisionNode>;

  findDecisionNode(
    contextSignature: string,
    agentId: string
  ): Promise<BehavioralDecisionNode | null>;

  findDecisionNodes(
    filter: BehavioralFilter
  ): Promise<PaginatedResponse<BehavioralDecisionNode>>;

  updateDecisionNode(
    id: string,
    updates: Partial<BehavioralDecisionNode>
  ): Promise<BehavioralDecisionNode>;

  // Cleanup operations
  pruneFeedback(agentId: string, olderThanDays: number): Promise<number>;
}
