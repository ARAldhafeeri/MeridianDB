import { BaseEntity } from "./base";

/**
 * Behavioral feedback - separate entity tracking memory usage effectiveness
 */
export interface MemoryBehavioralFeedback extends BaseEntity {
  readonly memoryEpisodeId: string;
  readonly agentId: string;
  readonly organizationId: string;

  // Task context when memory was used
  readonly taskId?: string;
  readonly taskType: string;
  readonly goalCategory?: string;
  readonly environment: string;

  // Performance metrics
  // updated first by AI Agent
  // Audited by a human in the loop
  // Which allow operators to gain full visiblity
  // on the agent performance
  // and identify bottlenicks
  readonly effectiveness: number; // 0-1, how helpful was this memory
  readonly relevance: number; // 0-1, how relevant to the task
  readonly accuracy: number; // 0-1, was the memory accurate/correct

  // Outcome tracking
  readonly taskSuccess: boolean; // did the overall task succeed
  readonly memoryContribution: "positive" | "negative" | "neutral";
  readonly confidence: number; // 0-1, agent's confidence when using this memory

  // Feedback source
  readonly feedbackSource: "agent" | "human" | "system";
  readonly humanAudited: boolean;
  readonly auditScore?: number; // human override score
  readonly auditNotes?: string;

  readonly usedAt: Date;
}
