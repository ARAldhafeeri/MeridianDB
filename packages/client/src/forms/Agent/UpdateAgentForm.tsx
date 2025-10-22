import { useAgentForm } from "../../hooks/useAgentForm";
import AgentForm from "./AgentForm";


import type { Agent } from "@meridiandb/shared/src/entities/agent";

export const UpdateAgentForm = ({agent}: {agent: Agent}) => {
  const formHook =  useAgentForm(agent, "update")
  return <AgentForm
    mode={"update"} 
    form={formHook.form}   
    onFormSubmit={formHook.onFormSubmit}
    onFormSubmitFailed={formHook.onFormSubmitFailed}
    contextHolder={formHook.contextHolder}
    balancedConfig={formHook.balancedConfig}
    aggressiveConfig={formHook.aggressiveConfig}
    longTermConfig={formHook.longTermConfig}
    mutation={formHook.mutation}
    loadConfigTemplate={formHook.loadConfigTemplate}
  />
};