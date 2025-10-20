// AgentContainer.tsx
import GlobalSearchInput from "../commons/GlobalSearchInput";
import { GlobalListView } from "../commons/GlobalListView";
import { useState, useMemo } from "react";
import { Space, Tag, Card, Descriptions, Typography, Progress, Button } from "antd";
import { AiFillPlusCircle } from "react-icons/ai";

const { Text } = Typography;

// Mock UI data for agents based on the correct entity
const mockAgents = [
  {
    id: "agent_001",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    capabilities: ["customer_service", "ticket_management", "faq_handling"],
    organizationId: "org_001",
    accessToken: "token_001",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
    version: 2,
    // AgentMemoriesFeaturesConfig properties (assuming based on context)
    stabilityThreshold: 0.85,
    successRate: 0.92,
    isActive: true
  },
  {
    id: "agent_002",
    name: "Data Analysis Assistant",
    description: "Processes and analyzes business data",
    capabilities: ["data_processing", "report_generation", "trend_analysis"],
    organizationId: "org_001",
    accessToken: "token_002",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-03-18"),
    version: 1,
    stabilityThreshold: 0.72,
    successRate: 0.68,
    isActive: false
  },
  {
    id: "agent_003",
    name: "Document Processor",
    description: "Automates document processing and categorization",
    capabilities: ["document_parsing", "content_categorization", "metadata_extraction"],
    organizationId: "org_002",
    accessToken: "token_003",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-03-22"),
    version: 3,
    stabilityThreshold: 0.91,
    successRate: 0.95,
    isActive: true
  },
  {
    id: "agent_004",
    name: "Research Analyst",
    description: "Assists with research and information gathering",
    capabilities: ["web_research", "information_synthesis", "source_validation"],
    organizationId: "org_002",
    accessToken: "token_004",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-25"),
    version: 1,
    stabilityThreshold: 0.78,
    successRate: 0.81,
    isActive: true
  },
  {
    id: "agent_005",
    name: "Workflow Coordinator",
    description: "Coordinates and manages business workflows",
    capabilities: ["workflow_management", "task_coordination", "process_automation"],
    organizationId: "org_001",
    accessToken: "token_005",
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-03-19"),
    version: 2,
    stabilityThreshold: 0.65,
    successRate: 0.59,
    isActive: false
  }
];

export default function AgentContainer() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter agents based on search input
  const filteredAgents = useMemo(() => {
    if (!searchValue.trim()) return mockAgents;
    
    return mockAgents.filter(agent =>
      agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
      agent.capabilities.some(capability => 
        capability.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle reset search
  const handleResetSearch = () => {
    setSearchValue("");
    setCurrentPage(1);
  };

  // Handle edit agent (mock function)
  const handleEdit = (agent: typeof mockAgents[0]) => {
    console.log("Editing agent:", agent);
    // Implement edit logic here
  };

  // Handle delete agent (mock function)
  const handleDelete = (agentId: string) => {
    console.log("Deleting agent with ID:", agentId);
    // Implement delete logic here
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render individual agent item
// Render individual agent item using Ant Design Descriptions
const renderAgentItem = (agent: typeof mockAgents[0]) => (
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
          <Tag color="blue">v{agent.version}</Tag>
        </Space>
      </Descriptions.Item>

      <Descriptions.Item label="Description" span={2}>
        {agent.description}
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

      <Descriptions.Item label="Organization">
        <Tag color="orange">{agent.organizationId}</Tag>
      </Descriptions.Item>

      {/* Third Row: Capabilities */}
      <Descriptions.Item label="Capabilities" span={3}>
        <Space size={[4, 4]} wrap>
          {agent.capabilities.map((capability, index) => (
            <Tag key={index} color="purple" style={{ fontSize: '11px', margin: 0 }}>
              {capability.replace(/_/g, ' ')}
            </Tag>
          ))}
        </Space>
      </Descriptions.Item>

      {/* Fourth Row: Metadata */}
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
  </Card>
);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Space direction="horizontal">
      <Button><AiFillPlusCircle/></Button>
      <GlobalSearchInput 
        name="Agent" 
        searchValue={searchValue} 
        onSearchChange={handleSearchChange} 
        onReset={handleResetSearch} 
      />
      </Space>
      <GlobalListView 
        data={filteredAgents}
        page={currentPage}
        total={filteredAgents.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getItem={renderAgentItem}
      />
    </Space>
  );
}