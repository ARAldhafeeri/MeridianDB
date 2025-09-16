import '@ant-design/v5-patch-for-react-19';

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  Input,
  Select,
  Form,
  Modal,
  Tabs,
  Progress,
  Statistic,
  Badge,
  Avatar,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  DatePicker,
  Slider,
  Switch,
  Drawer,
  ConfigProvider,
  theme,
  Breadcrumb,
  Dropdown,
  Tooltip,
} from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  RobotOutlined,
  SearchOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  DownloadOutlined,

  TrophyOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;

// Type definitions
interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  isActive: boolean;
  learningRate: number;
  createdAt: Date;
  totalMemories: number;
  lastActivity: Date;
  performance: number;
}

interface Memory {
  id: string;
  content: string;
  environment: string;
  task: string;
  recencyScore: number;
  accessFrequency: number;
  createdAt: Date;
  score: {
    composite: number;
    breakdown: {
      semantic: number;
      temporal: number;
      contextual: number;
      behavioral: number;
    };
  };
}

interface PerformanceData {
  date: string;
  performance: number;
  decisions: number;
  confidence: number;
}


interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    direction: 'up' | 'down';
    value: number;
    period: string;
  };
  icon: React.ReactNode;
  color: string;
}

interface AgentCardProps {
  agent: Agent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

interface MemoryCardProps {
  memory: Memory;
}


type PageKey = 'dashboard' | 'agents' | 'memory' | 'analytics' | 'settings';

// Mock data
const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Agent",
    description: "Handles customer inquiries and support tickets",
    capabilities: [
      "Natural Language Processing",
      "Sentiment Analysis",
      "Multi-language",
    ],
    isActive: true,
    learningRate: 0.85,
    createdAt: new Date("2024-01-15"),
    totalMemories: 15420,
    lastActivity: new Date("2024-09-10"),
    performance: 92,
  },
  {
    id: "2",
    name: "Data Analysis Agent",
    description: "Processes and analyzes business data",
    capabilities: ["Data Mining", "Statistical Analysis", "Report Generation"],
    isActive: true,
    learningRate: 0.91,
    createdAt: new Date("2024-02-20"),
    totalMemories: 8750,
    lastActivity: new Date("2024-09-09"),
    performance: 88,
  },
  {
    id: "3",
    name: "Content Moderation Agent",
    description: "Reviews and moderates user-generated content",
    capabilities: [
      "Content Analysis",
      "Risk Assessment",
      "Automated Moderation",
    ],
    isActive: false,
    learningRate: 0.76,
    createdAt: new Date("2024-03-10"),
    totalMemories: 12300,
    lastActivity: new Date("2024-09-08"),
    performance: 79,
  },
];

const mockMemories: Memory[] = [
  {
    id: "m1",
    content: "Customer asked about refund policy for premium subscription",
    environment: "Customer Support",
    task: "Query Resolution",
    recencyScore: 0.95,
    accessFrequency: 23,
    createdAt: new Date("2024-09-09"),
    score: {
      composite: 0.89,
      breakdown: {
        semantic: 0.92,
        temporal: 0.95,
        contextual: 0.88,
        behavioral: 0.82,
      },
    },
  },
  {
    id: "m2",
    content: "Analysis of quarterly sales data showing 15% growth",
    environment: "Data Analytics",
    task: "Data Processing",
    recencyScore: 0.88,
    accessFrequency: 45,
    createdAt: new Date("2024-09-08"),
    score: {
      composite: 0.92,
      breakdown: {
        semantic: 0.89,
        temporal: 0.88,
        contextual: 0.95,
        behavioral: 0.96,
      },
    },
  },
];

const performanceData: PerformanceData[] = [
  { date: "2024-09-01", performance: 85, decisions: 120, confidence: 0.82 },
  { date: "2024-09-02", performance: 87, decisions: 135, confidence: 0.85 },
  { date: "2024-09-03", performance: 90, decisions: 142, confidence: 0.88 },
  { date: "2024-09-04", performance: 88, decisions: 128, confidence: 0.86 },
  { date: "2024-09-05", performance: 92, decisions: 156, confidence: 0.91 },
  { date: "2024-09-06", performance: 94, decisions: 163, confidence: 0.93 },
  { date: "2024-09-07", performance: 91, decisions: 149, confidence: 0.89 },
];


const CaludePrototype: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isAgentModalVisible, setIsAgentModalVisible] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const menuItems: MenuProps['items'] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "agents",
      icon: <RobotOutlined />,
      label: "Agent Management",
    },
    {
      key: "memory",
      icon: <SearchOutlined />,
      label: "Memory Search",
    },
    {
      key: "analytics",
      icon: <BarChartOutlined />,
      label: "Behavioral Analytics",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const userMenu: MenuProps = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: 'Logout',
      },
    ],
  };

  const AgentCard: React.FC<AgentCardProps> = ({ agent, onEdit, onDelete, onToggleStatus }) => (
    <Card
      className="agent-card"
      hoverable
      actions={[
        <Tooltip title="Edit" key="edit">
          <EditOutlined onClick={() => onEdit(agent.id)} />
        </Tooltip>,
        <Tooltip title="View Details" key="view">
          <EyeOutlined onClick={() => setSelectedAgent(agent)} />
        </Tooltip>,
        <Tooltip title="Delete" key="delete">
          <DeleteOutlined onClick={() => onDelete(agent.id)} />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        avatar={
          <Badge dot={agent.isActive} color={agent.isActive ? "green" : "red"}>
            <Avatar
              size={64}
              icon={<RobotOutlined />}
              style={{
                backgroundColor: agent.isActive ? "#52c41a" : "#ff4d4f",
              }}
            />
          </Badge>
        }
        title={
          <Space>
            {agent.name}
            <Switch
              size="small"
              checked={agent.isActive}
              onChange={() => onToggleStatus(agent.id)}
            />
          </Space>
        }
        description={agent.description}
      />
      <div style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Memories" value={agent.totalMemories} />
          </Col>
          <Col span={8}>
            <Statistic
              title="Performance"
              value={agent.performance}
              suffix="%"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Learning Rate"
              value={agent.learningRate}
              precision={2}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 12 }}>
          <Text type="secondary">Capabilities:</Text>
          <div style={{ marginTop: 4 }}>
            {agent.capabilities.map((cap) => (
              <Tag key={cap} color="blue" style={{ marginBottom: 4 }}>
                {cap}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  const MemoryCard: React.FC<MemoryCardProps> = ({ memory }) => (
    <Card size="small" hoverable style={{ marginBottom: 8 }}>
      <Row>
        <Col span={16}>
          <Text strong>
            {memory.environment} - {memory.task}
          </Text>
          <Paragraph ellipsis={{ rows: 2 }} style={{ margin: "8px 0" }}>
            {memory.content}
          </Paragraph>
          <Space>
            <Tag color="green">
              Recency: {(memory.recencyScore * 100).toFixed(0)}%
            </Tag>
            <Tag color="blue">Accessed: {memory.accessFrequency}x</Tag>
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Progress
            type="circle"
            size={60}
            percent={Math.round(memory.score.composite * 100)}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
          <div style={{ marginTop: 8, fontSize: "12px" }}>
            <div>
              Semantic: {(memory.score.breakdown.semantic * 100).toFixed(0)}%
            </div>
            <div>
              Contextual: {(memory.score.breakdown.contextual * 100).toFixed(0)}%
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon, color }) => (
    <Card>
      <Statistic
        title={title}
        value={value}
        valueStyle={{ color }}
        prefix={icon}
        suffix={
          change && (
            <span
              style={{
                fontSize: "14px",
                color: change.direction === "up" ? "#3f8600" : "#cf1322",
              }}
            >
              {change.direction === "up" ? "↗" : "↘"} {change.value}%{" "}
              {change.period}
            </span>
          )
        }
      />
    </Card>
  );

  const renderDashboard = (): React.ReactElement => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Active Agents"
            value={2}
            change={{ direction: "up", value: 15, period: "this week" }}
            icon={<RobotOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Total Memories"
            value="36.5K"
            change={{ direction: "up", value: 8, period: "this week" }}
            icon={<RobotOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Avg Performance"
            value="90%"
            change={{ direction: "up", value: 3, period: "this week" }}
            icon={<TrophyOutlined />}
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="System Health"
            value="98.5%"
            change={{ direction: "down", value: 0.2, period: "today" }}
            icon={<HeartOutlined />}
            color="#eb2f96"
          />
        </Col>
      </Row>

      <Row >
      <Col span={24}>
      <Card
            title="Memories Access"
            extra={
              <Button size="small" icon={<DownloadOutlined />}>
                Export
              </Button>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#1890ff"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#52c41a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          </Col>
      </Row>
    </div>
  );

  const renderAgentManagement = (): React.ReactElement => (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Agent Management</Title>
        </Col>
        <Col>
          <Space>
            <Search
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAgentModalVisible(true)}
            >
              Create Agent
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {mockAgents
          .filter(
            (agent) =>
              agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              agent.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
          .map((agent) => (
            <Col xs={24} md={12} lg={8} key={agent.id}>
              <AgentCard
                agent={agent}
                onEdit={(id) => console.log("Edit agent:", id)}
                onDelete={(id) => console.log("Delete agent:", id)}
                onToggleStatus={(id) => console.log("Toggle status:", id)}
              />
            </Col>
          ))}
      </Row>
    </div>
  );

  const renderMemorySearch = (): React.ReactElement => (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Memory Search</Title>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setIsDrawerVisible(true)}
            >
              Filters
            </Button>
            <Button icon={<DownloadOutlined />}>Export</Button>
          </Space>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search memories using natural language..."
          size="large"
          onSearch={(value) => console.log("Search:", value)}
          enterButton="Search"
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card title={`Search Results (${mockMemories.length})`}>
            {mockMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderBehavioralAnalytics = (): React.ReactElement => (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Behavioral Analytics</Title>
        </Col>
        <Col>
          <Space>
            <RangePicker />
            <Button icon={<DownloadOutlined />}>Export Report</Button>
          </Space>
        </Col>
      </Row>
      <Card>
        <Text>Analytics features are temporarily disabled.</Text>
      </Card>
    </div>
  );

  const renderSettings = (): React.ReactElement => (
    <div>
      <Title level={2}>System Settings</Title>
      <Tabs defaultActiveKey="general">
        <TabPane tab="General" key="general">
          <Card>
            <Form layout="vertical">
              <Form.Item label="Organization Name">
                <Input defaultValue="AI Systems Corp" />
              </Form.Item>
              <Form.Item label="System Timezone">
                <Select defaultValue="UTC" style={{ width: "100%" }}>
                  <Select.Option value="UTC">UTC</Select.Option>
                  <Select.Option value="EST">Eastern Time</Select.Option>
                  <Select.Option value="PST">Pacific Time</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Default Learning Rate">
                <Slider
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  defaultValue={0.8}
                  marks={{ 0.1: "0.1", 0.5: "0.5", 1.0: "1.0" }}
                />
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        <TabPane tab="Security" key="security">
          <Card>
            <Form layout="vertical">
              <Form.Item label="Enable Two-Factor Authentication">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="Session Timeout (minutes)">
                <Input type="number" defaultValue={60} />
              </Form.Item>
              <Form.Item label="Password Policy">
                <Select defaultValue="strong" style={{ width: "100%" }}>
                  <Select.Option value="basic">Basic</Select.Option>
                  <Select.Option value="strong">Strong</Select.Option>
                  <Select.Option value="enterprise">Enterprise</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        <TabPane tab="Quotas" key="quotas">
          <Card>
            <Form layout="vertical">
              <Form.Item label="Max Agents per User">
                <Input type="number" defaultValue={10} />
              </Form.Item>
              <Form.Item label="Memory Storage Limit (GB)">
                <Input type="number" defaultValue={100} />
              </Form.Item>
              <Form.Item label="API Rate Limit (requests/hour)">
                <Input type="number" defaultValue={1000} />
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );

  const renderContent = (): React.ReactElement => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboard();
      case "agents":
        return renderAgentManagement();
      case "memory":
        return renderMemorySearch();
      case "analytics":
        return renderBehavioralAnalytics();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setCurrentPage(key as PageKey);
  };

  const AgentModal: React.FC = () => (
    <Modal
      title="Create New Agent"
      open={isAgentModalVisible}
      onCancel={() => setIsAgentModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsAgentModalVisible(false)}>
          Cancel
        </Button>,
        <Button key="submit" type="primary">
          Create Agent
        </Button>,
      ]}
      width={600}
    >
      <Form layout="vertical">
        <Form.Item label="Agent Name" required>
          <Input placeholder="Enter agent name" />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea placeholder="Describe the agent's purpose" rows={3} />
        </Form.Item>
        <Form.Item label="Capabilities">
          <Select
            mode="tags"
            placeholder="Add capabilities"
            style={{ width: "100%" }}
          >
            <Select.Option value="nlp">
              Natural Language Processing
            </Select.Option>
            <Select.Option value="ml">Machine Learning</Select.Option>
            <Select.Option value="analytics">Data Analytics</Select.Option>
            <Select.Option value="moderation">Content Moderation</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Learning Rate">
          <Slider
            min={0.1}
            max={1.0}
            step={0.1}
            defaultValue={0.8}
            marks={{ 0.1: "0.1", 0.5: "0.5", 1.0: "1.0" }}
          />
        </Form.Item>
        <Form.Item label="Stability Threshold">
          <Slider
            min={0.1}
            max={1.0}
            step={0.1}
            defaultValue={0.6}
            marks={{ 0.1: "0.1", 0.5: "0.5", 1.0: "1.0" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  const FilterDrawer: React.FC = () => (
    <Drawer
      title="Search Filters"
      placement="right"
      onClose={() => setIsDrawerVisible(false)}
      open={isDrawerVisible}
      width={350}
    >
      <Form layout="vertical">
        <Form.Item label="Environment">
          <Select placeholder="Select environment" style={{ width: "100%" }}>
            <Select.Option value="customer_support">
              Customer Support
            </Select.Option>
            <Select.Option value="data_analytics">Data Analytics</Select.Option>
            <Select.Option value="content_moderation">
              Content Moderation
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Task Type">
          <Select placeholder="Select task type" style={{ width: "100%" }}>
            <Select.Option value="query_resolution">
              Query Resolution
            </Select.Option>
            <Select.Option value="data_processing">
              Data Processing
            </Select.Option>
            <Select.Option value="content_analysis">
              Content Analysis
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Time Range">
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Recency Score">
          <Slider range min={0} max={100} defaultValue={[0, 100]} />
        </Form.Item>
        <Form.Item label="Access Frequency">
          <Slider range min={0} max={100} defaultValue={[0, 100]} />
        </Form.Item>
      </Form>
      <Space>
        <Button type="primary">Apply Filters</Button>
        <Button>Clear All</Button>
      </Space>
    </Drawer>
  );

  const AgentDetailModal: React.FC = () => (
    <Modal
      title={selectedAgent?.name}
      open={!!selectedAgent}
      onCancel={() => setSelectedAgent(null)}
      footer={[
        <Button key="close" onClick={() => setSelectedAgent(null)}>
          Close
        </Button>,
      ]}
      width={800}
    >
      {selectedAgent && (
        <Tabs defaultActiveKey="overview">
          <TabPane tab="Overview" key="overview">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Status" size="small">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text>Status: </Text>
                      <Badge
                        status={selectedAgent.isActive ? "processing" : "error"}
                        text={selectedAgent.isActive ? "Active" : "Inactive"}
                      />
                    </div>
                    <div>
                      <Text>Total Memories: </Text>
                      <Text strong>
                        {selectedAgent.totalMemories.toLocaleString()}
                      </Text>
                    </div>
                    <div>
                      <Text>Performance: </Text>
                      <Text strong>{selectedAgent.performance}%</Text>
                    </div>
                    <div>
                      <Text>Learning Rate: </Text>
                      <Text strong>{selectedAgent.learningRate}</Text>
                    </div>
                    <div>
                      <Text>Created: </Text>
                      <Text>
                        {selectedAgent.createdAt.toLocaleDateString()}
                      </Text>
                    </div>
                    <div>
                      <Text>Last Activity: </Text>
                      <Text>
                        {selectedAgent.lastActivity.toLocaleDateString()}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Capabilities" size="small">
                  <Space wrap>
                    {selectedAgent.capabilities.map((cap) => (
                      <Tag key={cap} color="blue">
                        {cap}
                      </Tag>
                    ))}
                  </Space>
                </Card>
                <Card
                  title="Performance Metrics"
                  size="small"
                  style={{ marginTop: 16 }}
                >
                  <Progress
                    percent={selectedAgent.performance}
                    status="active"
                  />
                  <Text type="secondary">Overall Performance</Text>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Configuration" key="configuration">
            <Form layout="vertical">
              <Form.Item label="Agent Name">
                <Input defaultValue={selectedAgent.name} />
              </Form.Item>
              <Form.Item label="Description">
                <Input.TextArea
                  defaultValue={selectedAgent.description}
                  rows={3}
                />
              </Form.Item>
              <Form.Item label="Learning Rate">
                <Slider
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  defaultValue={selectedAgent.learningRate}
                />
              </Form.Item>
              <Form.Item label="Active Status">
                <Switch defaultChecked={selectedAgent.isActive} />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      )}
    </Modal>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          style={{
            boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
          }}
        >
          <div
            style={{
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
              {collapsed ? "AI" : "AI Systems"}
            </Title>
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[currentPage]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: "0 24px",
              background: "#fff",
              boxShadow: "0 2px 8px #f0f1f2",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Breadcrumb>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>
               BreadcrumbPlaceHodler
              </Breadcrumb.Item>
            </Breadcrumb>

            <Space size="large">
              <Badge count={3}>
                <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
              </Badge>
              <Dropdown menu={userMenu} trigger={["click"]}>
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  style={{ cursor: "pointer", backgroundColor: "#1890ff" }}
                />
              </Dropdown>
            </Space>
          </Header>

          <Content
            style={{
              margin: "24px",
              padding: "24px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow:
                "0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)",
            }}
          >
            {renderContent()}
          </Content>
        </Layout>

        <AgentModal />
        <FilterDrawer />
        <AgentDetailModal />
      </Layout>
    </ConfigProvider>
  );
};

export default CaludePrototype;