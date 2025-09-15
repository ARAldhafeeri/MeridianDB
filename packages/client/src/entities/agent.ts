import { BaseComponentProps } from "./base";

export interface AgentCardProps extends BaseComponentProps {
  readonly agent: {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly capabilities: string[];
    readonly isActive: boolean;
    readonly learningRate: number;
    readonly createdAt: Date;
  };
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly onToggleStatus: (id: string) => void;
}

export interface AgentFormProps extends BaseComponentProps {
  readonly initialData?: {
    readonly name?: string;
    readonly description?: string;
    readonly capabilities?: string[];
    readonly learningRate?: number;
    readonly stabilityThreshold?: number;
  };
  readonly onSubmit: (data: any) => void;
  readonly onCancel: () => void;
}

export interface AgentStatusProps extends BaseComponentProps {
  readonly agentId: string;
  readonly status: {
    readonly isActive: boolean;
    readonly totalMemories: number;
    readonly lastActivity: Date;
    readonly performance: number;
  };
}
