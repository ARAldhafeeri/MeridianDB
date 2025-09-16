import { ServiceResult } from "./base";
import { StoreBehavioralFeedbackRequest, UpdateDecisionTreeRequest, AuditFeedbackRequest, BehavioralDecisionNode, MemoryBehavioralFeedback } from "../../domain/behavioral";
export interface BehavioralService {
    recordFeedback(request: StoreBehavioralFeedbackRequest): Promise<ServiceResult<MemoryBehavioralFeedback>>;
    getFeedbackHistory(memoryEpisodeId: string, agentId: string): Promise<ServiceResult<MemoryBehavioralFeedback[]>>;
    updateDecisionTree(request: UpdateDecisionTreeRequest): Promise<ServiceResult<BehavioralDecisionNode>>;
    getDecisionPatterns(agentId: string, taskType?: string, environment?: string): Promise<ServiceResult<BehavioralDecisionNode[]>>;
    submitAudit(request: AuditFeedbackRequest): Promise<ServiceResult<MemoryBehavioralFeedback>>;
}
//# sourceMappingURL=behavioral.d.ts.map