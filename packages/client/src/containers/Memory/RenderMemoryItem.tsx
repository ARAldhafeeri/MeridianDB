import {  Tag, Card, Descriptions, Typography, Progress, Collapse } from "antd";
import type { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
import { MemoryStage, AccessLevel } from "@meridiandb/shared/src/entities/enums";
import { formatDate } from "../../utilts/containers";
const { Text } = Typography;
const { Panel } = Collapse;

export const renderMemoryItem = (memory: MemoryEpisode) => (
  <Card size="small" style={{ width: '100%', marginBottom: 8 }}>
    <Descriptions 
      column={{ xs: 1, sm: 2, md: 3 }}
      size="small"
      layout="vertical"
    >
      {/* Content */}
      <Descriptions.Item label="Content" span={3}>
        <Text>{memory.content}</Text>
      </Descriptions.Item>

      {/* Basic Identification */}
      <Descriptions.Item label="Agent ID">
        <Text code>{memory.agentId?.substring(0, 8)}...</Text>
      </Descriptions.Item>

      <Descriptions.Item label="Organization">
        <Text code>{memory.organizationId?.substring(0, 8)}...</Text>
      </Descriptions.Item>

      <Descriptions.Item label="Access Level">
        <Tag color={
        memory.accessLevel === AccessLevel.PUBLIC ? 'green' :
          memory.accessLevel === AccessLevel.FEDERATED ? 'blue' :
          memory.accessLevel === AccessLevel.ORGANIZATION ? 'orange' : 'red'
        }>
          {memory.accessLevel}
        </Tag>
      </Descriptions.Item>

      {/* Temporal Features */}
      <Descriptions.Item label="Recency Score">
        <Progress 
          percent={Math.round(memory.recencyScore * 100)} 
          size="small" 
        />
      </Descriptions.Item>

      <Descriptions.Item label="Access Frequency">
        <Progress 
          percent={Math.round(memory.accessFrequency * 100)} 
          size="small"
        />
      </Descriptions.Item>

      <Descriptions.Item label="Last Accessed">
        {memory.lastAccessedAt ? formatDate(memory.lastAccessedAt) : 'Never'}
      </Descriptions.Item>

      {/* Behavioral Features */}
      <Descriptions.Item label="Success Rate">
        <Progress 
          percent={Math.round(memory.successRate * 100)} 
          size="small"
        />
      </Descriptions.Item>

      <Descriptions.Item label="Positive">
        <Tag color="green">{memory.positive}</Tag>
      </Descriptions.Item>

      <Descriptions.Item label="Negative">
        <Tag color="red">{memory.negative}</Tag>
      </Descriptions.Item>

      {/* Flags */}
      <Descriptions.Item label="Factual">
        <Tag color={memory.isFactual ? 'green' : 'default'}>
          {memory.isFactual ? 'Yes' : 'No'}
        </Tag>
      </Descriptions.Item>

      <Descriptions.Item label="Irrelevant">
        <Tag color={memory.isIrrelevant ? 'red' : 'default'}>
          {memory.isIrrelevant ? 'Yes' : 'No'}
        </Tag>
      </Descriptions.Item>

      <Descriptions.Item label="Stage">
        <Tag color={
          memory.stage === MemoryStage.EPISODIC ? 'purple' :
          memory.stage === MemoryStage.CONSOLIDATING ? 'blue' :
          memory.stage === MemoryStage.CONSOLIDATED ? 'green' : 'orange'
        }>
          {memory.stage}
        </Tag>
      </Descriptions.Item>

      {/* Dates */}
      <Descriptions.Item label="Created">
        {formatDate(memory.createdAt)}
      </Descriptions.Item>

      <Descriptions.Item label="Updated">
        {formatDate(memory.updatedAt)}
      </Descriptions.Item>

      <Descriptions.Item label="Memory ID">
        <Text code style={{ fontSize: '10px' }}>
          {memory?.id?.substring(0, 12)}...
        </Text>
      </Descriptions.Item>
    </Descriptions>

    {/* Context Section */}
    <Collapse size="small" style={{ marginTop: 8 }}>
      <Panel header="Context" key="1">
        <Text style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
          {memory.context}
        </Text>
      </Panel>
    </Collapse>
  </Card>
);