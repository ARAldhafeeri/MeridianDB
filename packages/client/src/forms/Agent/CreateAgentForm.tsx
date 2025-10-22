import { useAgentForm } from "../../hooks/useAgentForm"
import AgentForm from "./AgentForm"

export const CreateAgentForm = () => {
  const formHook =  useAgentForm(undefined, "create")
  return <AgentForm
    mode={"create"} 
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
 }
