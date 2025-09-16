import { ServiceResult } from "./base";
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
    request: StoreBehavioralFeedbackRequest
  ): Promise<ServiceResult<MemoryBehavioralFeedback>>;

  getFeedbackHistory(
    memoryEpisodeId: string,
    agentId: string
  ): Promise<ServiceResult<MemoryBehavioralFeedback[]>>;

  // Decision tree management
  updateDecisionTree(
    request: UpdateDecisionTreeRequest
  ): Promise<ServiceResult<BehavioralDecisionNode>>;

  getDecisionPatterns(
    agentId: string,
    taskType?: string,
    environment?: string
  ): Promise<ServiceResult<BehavioralDecisionNode[]>>;

  // Human audit workflow
  submitAudit(
    request: AuditFeedbackRequest
  ): Promise<ServiceResult<MemoryBehavioralFeedback>>;
}
