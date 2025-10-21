import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, message, } from 'antd';
import { ENDPOINTS, UPDATE_AGENT_ENDPOINT } from '../config/endpoints';
import { useContext, useEffect } from 'react';
import { api } from '../api/index';
import { AGENT_FETCH_QUERY_KEY } from '../config/queries';
import { ModalContext } from '../contexts/ModalContext';

// types 
import type { Agent } from "@meridiandb/shared/src/entities/agent";
import type {FormInstance} from "antd";
import type { AxiosResponse } from 'axios';
import type {UseMutationResult} from "@tanstack/react-query";


// Predefined configuration templates
const balancedConfig = {
  stabilityThreshold: 0.5,
  halfLifeHours: 168,      // 7 days
  timeWeight: 0.6,
  frequencyWeight: 0.4,
  decayCurve: 'hybrid' as const,
  successRate: 0.8,
  decayFloor: 0.15
};

const aggressiveConfig = {
  stabilityThreshold: 0.3,
  halfLifeHours: 72,       // 3 days
  timeWeight: 0.7,
  frequencyWeight: 0.3,
  decayCurve: 'exponential' as const,
  successRate: 0.7
};

const longTermConfig = {
  stabilityThreshold: 0.7,
  halfLifeHours: 720,      // 30 days
  timeWeight: 0.5,
  frequencyWeight: 0.5,
  decayCurve: 'polynomial' as const,
  successRate: 0.9
};

interface IUseAgentFormReturnValue {
  loadConfigTemplate(config: typeof balancedConfig | typeof aggressiveConfig | typeof longTermConfig) : void;
  onFormSubmit(values: any) : void;
  onFormSubmitFailed(errorInfo: any): void;
  contextHolder: React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
  balancedConfig: typeof balancedConfig;
  longTermConfig: typeof longTermConfig;
  aggressiveConfig: typeof aggressiveConfig;
  mutation: UseMutationResult<AxiosResponse<any, any, {}>, Error, Partial<Agent>, unknown>
  form: FormInstance<any>
}

export const useAgentForm = (agent : Agent | undefined, mode: string) : IUseAgentFormReturnValue => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
    // modal context 
    const modalContext = useContext(ModalContext);
 
    if (!modalContext) {
      throw new Error("ModalContext must be used within a ModalContextProvider");
    }
  
    const { closeModal }  = modalContext;

  // Create agent mutation
  const createMutation = useMutation({
    mutationFn: (data: Partial<Agent>) => {
      return api.post(ENDPOINTS.agents, {
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENT_FETCH_QUERY_KEY] });
      messageApi.success('Agent created successfully!');
      form.resetFields();
      closeModal();

    },
    onError: () => {
      messageApi.error('Failed to create agent!');
    },
  });

  // Update agent mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Agent>) => {
      if (!agent?.id) throw new Error('Agent ID not found');
      return api.put(UPDATE_AGENT_ENDPOINT(agent.id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENT_FETCH_QUERY_KEY] });
      messageApi.success('Agent updated successfully!');
      closeModal();
    },
    onError: () => {
      messageApi.error('Failed to update agent!');
    },
  });

  const mutation = mode === 'create' ? createMutation : updateMutation;

  // Set form initial values when agent data is provided
  useEffect(() => {
    if (mode === 'update' && agent) {
      form.setFieldsValue({
        name: agent.name,
        description: agent.description,
        capabilities: agent.capabilities,
        stabilityThreshold: agent.stabilityThreshold,
        halfLifeHours: agent.halfLifeHours,
        timeWeight: agent.timeWeight,
        frequencyWeight: agent.frequencyWeight,
        decayCurve: agent.decayCurve,
        successRate: agent.successRate,
        isActive: agent.isActive,
        metadata: agent.metadata ? JSON.stringify(agent.metadata, null, 2) : '',
      });
    } else if (mode === 'create') {
      // Set default values for create mode (balanced config)
      form.setFieldsValue({
        stabilityThreshold: balancedConfig.stabilityThreshold,
        halfLifeHours: balancedConfig.halfLifeHours,
        timeWeight: balancedConfig.timeWeight,
        frequencyWeight: balancedConfig.frequencyWeight,
        decayCurve: balancedConfig.decayCurve,
        successRate: balancedConfig.successRate,
        isActive: true,
        metadata: '{}',
      });
    }
  }, [agent, form, mode]);

  const onFormSubmit = (values: any) => {
    const processedValues = {
      ...values,
      capabilities: Array.isArray(values.capabilities) 
        ? values.capabilities 
        : values.capabilities?.split(',').map((cap: string) => cap.trim()).filter(Boolean) || [],
      metadata: values.metadata ? JSON.parse(values.metadata) : {},
    };

    mutation.mutate(processedValues);
  };

  const onFormSubmitFailed = (errorInfo: any) => {
    console.log('Form submission failed:', errorInfo);
    messageApi.error('Please check the form for errors!');
  };

  const loadConfigTemplate = (config: typeof balancedConfig | typeof aggressiveConfig | typeof longTermConfig) => {
    form.setFieldsValue({
      stabilityThreshold: config.stabilityThreshold,
      halfLifeHours: config.halfLifeHours,
      timeWeight: config.timeWeight,
      frequencyWeight: config.frequencyWeight,
      decayCurve: config.decayCurve,
      successRate: config.successRate,
    });
    messageApi.info('Configuration template loaded! You can modify the values as needed.');
  };

  return {
    loadConfigTemplate,
    onFormSubmit,
    onFormSubmitFailed,
    contextHolder, 
    balancedConfig, 
    aggressiveConfig,
    longTermConfig,
    mutation,
    form
  }
}