import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, Button, Spin, message, Flex, Switch, Select, InputNumber, Space, Card } from 'antd';
import { ENDPOINTS, UPDATE_AGENT_ENDPOINT } from '../config/endpoints';
import { useEffect } from 'react';
import { api } from '../api/index';
import type { Agent } from "@meridiandb/shared/src/entities/agent";
import { AGENT_FETCH_QUERY_KEY } from '../config/queries';

const { TextArea } = Input;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

interface AgentFormProps {
  mode: 'create' | 'update';
  agent?: Agent; // Agent data passed directly for update mode
}

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

export default function AgentForm({ mode, agent }: AgentFormProps) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

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

  return (
    <div className='auth-form-container'>
      {contextHolder}
      
      {/* Configuration Templates Section */}
      <Card 
        title="Quick Configuration Templates" 
        style={{ marginBottom: 24 }}
        size="small"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <p style={{ marginBottom: 8, fontSize: '12px', color: '#666' }}>
              Choose a pre-configured template or set values manually
            </p>
            <Space wrap>
              <Button 
                type="default" 
                size="small"
                onClick={() => loadConfigTemplate(balancedConfig)}
              >
                🎯 Balanced
              </Button>
              <Button 
                type="default" 
                size="small"
                onClick={() => loadConfigTemplate(aggressiveConfig)}
              >
                ⚡ Aggressive
              </Button>
              <Button 
                type="default" 
                size="small"
                onClick={() => loadConfigTemplate(longTermConfig)}
              >
                🗳️ Long-Term
              </Button>
            </Space>
          </div>
          
          {/* Template Descriptions */}
          <Space direction="vertical" size={0} style={{ fontSize: '12px', color: '#888' }}>
            <div><strong>Balanced:</strong> General purpose (7-day retention)</div>
            <div><strong>Aggressive:</strong> Fast forgetting (3-day retention)</div>
            <div><strong>Long-Term:</strong> Extended memory (30-day retention)</div>
          </Space>
        </Space>
      </Card>

      <Form
        form={form}
        name="agent-form"
        {...layout}
        layout="vertical"
        className='auth-form'
        autoComplete="off"
        style={{ maxWidth: 600 }}
        onFinish={onFormSubmit}
        onFinishFailed={onFormSubmitFailed}
      >
        <Form.Item
          label="Agent Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter agent name!',
            },
            {
              min: 2,
              message: 'Agent name must be at least 2 characters!',
            },
          ]}
        >
          <Input 
            placeholder="Enter agent name"
            type="text"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              max: 500,
              message: 'Description must not exceed 500 characters!',
            },
          ]}
        >
          <TextArea 
            placeholder="Enter agent description"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          label="Capabilities"
          name="capabilities"
          rules={[
            {
              required: true,
              message: 'Please enter at least one capability!',
            },
          ]}
        >
          <Select
            mode="tags"
            placeholder="Enter agent capabilities (type and press enter)"
            tokenSeparators={[',']}
          />
        </Form.Item>

        {/* Memory Configuration Section */}
        <Card title="Memory Configuration" size="small" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Stability Threshold"
            name="stabilityThreshold"
            tooltip="Threshold for memory consolidation (0-1)"
            rules={[
              {
                required: true,
                message: 'Please enter stability threshold!',
              },
            ]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              placeholder="0.0 - 1.0"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Half Life Hours"
            name="halfLifeHours"
            tooltip="Time until memory strength reduces by half"
            rules={[
              {
                required: true,
                message: 'Please enter half life hours!',
              },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Hours"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Time Weight"
            name="timeWeight"
            tooltip="Weight given to time factor in decay calculation (0-1)"
            rules={[
              {
                required: true,
                message: 'Please enter time weight!',
              },
            ]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              placeholder="0.0 - 1.0"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Frequency Weight"
            name="frequencyWeight"
            tooltip="Weight given to frequency factor in decay calculation (0-1)"
            rules={[
              {
                required: true,
                message: 'Please enter frequency weight!',
              },
            ]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              placeholder="0.0 - 1.0"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Decay Curve"
            name="decayCurve"
            tooltip="Mathematical model for memory decay"
            rules={[
              {
                required: true,
                message: 'Please select decay curve!',
              },
            ]}
          >
            <Select placeholder="Select decay curve">
              <Option value="exponential">Exponential</Option>
              <Option value="hybrid">Hybrid</Option>
              <Option value="polynomial">Polynomial</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Success Rate"
            name="successRate"
            tooltip="Minimum success rate for memory retention (0-1)"
            rules={[
              {
                required: true,
                message: 'Please enter success rate!',
              },
            ]}
          >
            <InputNumber
              min={0}
              max={1}
              step={0.1}
              placeholder="0.0 - 1.0"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Card>

        <Form.Item
          label="Active"
          name="isActive"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Metadata"
          name="metadata"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch {
                  return Promise.reject(new Error('Please enter valid JSON!'));
                }
              },
            },
          ]}
        >
          <TextArea 
            placeholder='Enter metadata as JSON (e.g., {"key": "value"})'
            rows={4}
          />
        </Form.Item>
       
        <div>
          <Button 
            type="primary"
            htmlType='submit' 
            loading={mutation.isPending}
            size="large"
          >
            {mode === 'create' ? 'Create Agent' : 'Update Agent'}
          </Button>
        </div>
      </Form>
    </div>
  );
}