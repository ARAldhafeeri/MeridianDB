import { Space, Tag, Card, Descriptions, Typography, Progress, Collapse } from "antd";
import type { Agent } from "@meridiandb/shared/src/entities/agent";
import { formatDate } from "../../utilts/containers";
const { Text } = Typography;
const { Panel } = Collapse;

// Render individual agent item using Ant Design Descriptions
export const renderAgentItem = (agent: Agent) => (
  <Card size="small" style={{ width: '100%', marginBottom: 8 }}>
    <Descriptions 
      column={{ xs: 1, sm: 2, md: 3 }}
      size="small"
      layout="vertical"
      labelStyle={{ fontWeight: 'bold', fontSize: '12px' }}
      contentStyle={{ fontSize: '12px' }}
    >
      {/* First Row: Basic Info */}
      <Descriptions.Item label="Agent Name" span={1}>
        <Space>
          <Text strong>{agent.name}</Text>
          <Tag color={agent.isActive ? 'green' : 'red'}>
            {agent.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </Space>
      </Descriptions.Item>

      <Descriptions.Item label="Version">
        <Tag color="blue">v{agent.version}</Tag>
      </Descriptions.Item>

      <Descriptions.Item label="Organization">
        <Tag color="orange">{agent.organizationId}</Tag>
      </Descriptions.Item>

      {/* Second Row: Performance Metrics */}
      <Descriptions.Item label="Stability Threshold">
        <Progress 
          percent={Math.round(agent.stabilityThreshold * 100)} 
          size="small" 
          strokeColor={agent.stabilityThreshold > 0.8 ? '#52c41a' : agent.stabilityThreshold > 0.7 ? '#faad14' : '#ff4d4f'}
          format={percent => `${percent}%`}
        />
      </Descriptions.Item>

      <Descriptions.Item label="Success Rate">
        <Progress 
          percent={Math.round(agent.successRate * 100)} 
          size="small"
          strokeColor={agent.successRate > 0.8 ? '#52c41a' : agent.successRate > 0.7 ? '#faad14' : '#ff4d4f'}
          format={percent => `${percent}%`}
        />
      </Descriptions.Item>

      <Descriptions.Item label="Half-Life">
        <Tag color="cyan">{agent.halfLifeHours}h</Tag>
      </Descriptions.Item>

      {/* Third Row: Temporal Features */}
      <Descriptions.Item label="Time Weight">
        <Progress 
          percent={Math.round(agent.timeWeight * 100)} 
          size="small"
          strokeColor="#1890ff"
          format={percent => `${percent}%`}
        />
      </Descriptions.Item>

      <Descriptions.Item label="Frequency Weight">
        <Progress 
          percent={Math.round(agent.frequencyWeight * 100)} 
          size="small"
          strokeColor="#722ed1"
          format={percent => `${percent}%`}
        />
      </Descriptions.Item>

      <Descriptions.Item label="Decay Curve">
        <Tag 
          color={
            agent.decayCurve === 'exponential' ? 'green' : 
            agent.decayCurve === 'hybird' ? 'orange' : 'purple'
          }
        >
          {agent.decayCurve.charAt(0).toUpperCase() + agent.decayCurve.slice(1)}
        </Tag>
      </Descriptions.Item>

      {/* Fourth Row: Capabilities */}
      <Descriptions.Item label="Capabilities" span={3}>
        <Space size={[4, 4]} wrap>
          {agent.capabilities.map((capability, index) => (
            <Tag key={index} color="purple" style={{ fontSize: '11px', margin: 0 }}>
              {capability.replace(/_/g, ' ')}
            </Tag>
          ))}
        </Space>
      </Descriptions.Item>

      {/* Fifth Row: Dates and ID */}
      <Descriptions.Item label="Agent ID">
        <Text code style={{ fontSize: '11px' }}>
          {agent.id}
        </Text>
      </Descriptions.Item>

      <Descriptions.Item label="Created">
        {formatDate(agent.createdAt)}
      </Descriptions.Item>

      <Descriptions.Item label="Last Updated">
        <Text strong>{formatDate(agent.updatedAt)}</Text>
      </Descriptions.Item>
    </Descriptions>

    {/* Collapsible Metadata Section */}
    {agent.metadata && Object.keys(agent.metadata).length > 0 && (
      <Collapse size="small" style={{ marginTop: 8 }}>
        <Panel header="Metadata" key="1">
          <Descriptions 
            column={{ xs: 1, sm: 2, md: 2 }}
            size="small"
            labelStyle={{ fontWeight: 'bold', fontSize: '11px' }}
            contentStyle={{ fontSize: '11px' }}
          >
            {Object.entries(agent.metadata).map(([key, value]) => (
              <Descriptions.Item key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}>
                {typeof value === 'string' ? (
                  <Text>{value}</Text>
                ) : typeof value === 'number' ? (
                  <Text strong>{value}</Text>
                ) : Array.isArray(value) ? (
                  <Space size={[4, 4]} wrap>
                    {value.map((item, index) => (
                      <Tag key={index} color="geekblue" style={{ fontSize: '10px', margin: 0 }}>
                        {String(item)}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Text code style={{ fontSize: '10px' }}>
                    {JSON.stringify(value)}
                  </Text>
                )}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Panel>
      </Collapse>
    )}
  </Card>
);