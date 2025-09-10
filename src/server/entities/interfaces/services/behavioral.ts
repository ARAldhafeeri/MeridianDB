import { ServiceContext, ServiceResult } from "./base";
import {
  StoreBehavioralFeedbackRequest,
  UpdateDecisionTreeRequest,
  AuditFeedbackRequest,
  BehavioralDecisionNode,
  MemoryBehavioralFeedback,
} from "../../domain/behavioral";

export interface BehavioralService {
  // Core feedback operations
  recordFeedback(
    request: StoreBehavioralFeedbackRequest,
    context: ServiceContext
  ): Promise<ServiceResult<MemoryBehavioralFeedback>>;

  getFeedbackHistory(
    memoryEpisodeId: string,
    agentId: string,
    context: ServiceContext
  ): Promise<ServiceResult<MemoryBehavioralFeedback[]>>;

  // Decision tree management
  updateDecisionTree(
    request: UpdateDecisionTreeRequest,
    context: ServiceContext
  ): Promise<ServiceResult<BehavioralDecisionNode>>;

  getDecisionPatterns(
    agentId: string,
    taskType?: string,
    environment?: string,
    context?: ServiceContext
  ): Promise<ServiceResult<BehavioralDecisionNode[]>>;

  // Human audit workflow
  submitAudit(
    request: AuditFeedbackRequest,
    context: ServiceContext
  ): Promise<ServiceResult<MemoryBehavioralFeedback>>;
}
