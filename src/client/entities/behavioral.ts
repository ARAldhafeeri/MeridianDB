import { BaseComponentProps } from "./base";

export interface FeedbackFormProps extends BaseComponentProps {
  readonly memoryId: string;
  readonly onSubmit: (feedback: {
    readonly effectiveness: number;
    readonly relevance: number;
    readonly accuracy: number;
    readonly taskSuccess: boolean;
    readonly confidence: number;
  }) => void;
}

export interface RiskIndicatorProps extends BaseComponentProps {
  readonly risk: {
    readonly level: "low" | "medium" | "high";
    readonly factors: {
      readonly tunnelVision: number;
      readonly overConfidence: number;
      readonly staleness: number;
      readonly contextMismatch: number;
    };
  };
}

export interface DecisionPatternsProps extends BaseComponentProps {
  readonly patterns: Array<{
    readonly contextSignature: string;
    readonly taskType: string;
    readonly successRate: number;
    readonly totalDecisions: number;
    readonly avgConfidence: number;
  }>;
}
