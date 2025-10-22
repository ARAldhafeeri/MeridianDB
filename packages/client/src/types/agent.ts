import type {
  Agent,
  AgentMemoriesFeaturesConfig,
} from "@meridiandb/shared/src/entities/agent";
import type { FormInstance } from "antd";
import type { AxiosResponse } from "axios";
import type { UseMutationResult } from "@tanstack/react-query";

type PartialAgentMemoriesFeaturesConfig = Partial<AgentMemoriesFeaturesConfig>;

export interface IUseAgentFormReturnValue {
  loadConfigTemplate(config: PartialAgentMemoriesFeaturesConfig): void;
  onFormSubmitFailed(errorInfo: any): void;
  onFormSubmit(values: Partial<Agent>): void;
  contextHolder: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<any>
  >;
  balancedConfig: PartialAgentMemoriesFeaturesConfig;
  longTermConfig: PartialAgentMemoriesFeaturesConfig;
  aggressiveConfig: PartialAgentMemoriesFeaturesConfig;
  mutation: UseMutationResult<
    AxiosResponse<any, any, {}>,
    Error,
    Partial<Agent>,
    unknown
  >;
  form: FormInstance<any>;
}
