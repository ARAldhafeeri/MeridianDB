import '@ant-design/v5-patch-for-react-19';


import React, { useState, useMemo } from "react";
import {
  Layout,
  Menu,
  Card,
  Table,
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
  Alert,
  DatePicker,
  Slider,
  Switch,
  Drawer,
  ConfigProvider,
  theme,
  Breadcrumb,
  Dropdown,
  Tooltip,
  Timeline,
  Rate,
  Divider,
} from "antd";
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
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  HeartOutlined,
  BrainOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { RangePicker } = DatePicker;

// Mock data
const mockAgents = [
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

const mockMemories = [
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

const performanceData = [
  { date: "2024-09-01", performance: 85, decisions: 120, confidence: 0.82 },
  { date: "2024-09-02", performance: 87, decisions: 135, confidence: 0.85 },
  { date: "2024-09-03", performance: 90, decisions: 142, confidence: 0.88 },
  { date: "2024-09-04", performance: 88, decisions: 128, confidence: 0.86 },
  { date: "2024-09-05", performance: 92, decisions: 156, confidence: 0.91 },
  { date: "2024-09-06", performance: 94, decisions: 163, confidence: 0.93 },
  { date: "2024-09-07", performance: 91, decisions: 149, confidence: 0.89 },
];

const memoryDistribution = [
  { name: "Customer Support", value: 35, color: "#1890ff" },
  { name: "Data Analytics", value: 28, color: "#52c41a" },
  { name: "Content Moderation", value: 22, color: "#fa8c16" },
  { name: "General Tasks", value: 15, color: "#eb2f96" },
];

const riskFactors = [
  { name: "Tunnel Vision", value: 15, status: "low" },
  { name: "Over Confidence", value: 32, status: "medium" },
  { name: "Staleness", value: 8, status: "low" },
  { name: "Context Mismatch", value: 45, status: "high" },
];

const CaludePrototype = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isAgentModalVisible, setIsAgentModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
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

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  const AgentCard = ({ agent, onEdit, onDelete, onToggleStatus }) => (
    <Card
      className="agent-card"
      hoverable
      actions={[
        <Tooltip title="Edit">
          <EditOutlined onClick={() => onEdit(agent.id)} />
        </Tooltip>,
        <Tooltip title="View Details">
          <EyeOutlined onClick={() => setSelectedAgent(agent)} />
        </Tooltip>,
        <Tooltip title="Delete">
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

  const MemoryCard = ({ memory }) => (
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
              Contextual: {(memory.score.breakdown.contextual * 100).toFixed(0)}
              %
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const StatsCard = ({ title, value, change, icon, color }) => (
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

  const RiskIndicator = ({ risk }) => {
    const getRiskColor = (level) => {
      switch (level) {
        case "low":
          return "#52c41a";
        case "medium":
          return "#fa8c16";
        case "high":
          return "#ff4d4f";
        default:
          return "#d9d9d9";
      }
    };

    return (
      <Card title="Risk Assessment" size="small">
        <Space direction="vertical" style={{ width: "100%" }}>
          {Object.entries(risk.factors).map(([factor, value]) => (
            <div key={factor}>
              <Row justify="space-between">
                <Text>
                  {factor
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Text>
                <Text strong>{value}%</Text>
              </Row>
              <Progress
                percent={value}
                strokeColor={getRiskColor(
                  value > 40 ? "high" : value > 20 ? "medium" : "low"
                )}
                size="small"
                showInfo={false}
              />
            </div>
          ))}
        </Space>
      </Card>
    );
  };

  const renderDashboard = () => (
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
            icon={<BrainOutlined />}
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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Performance Trends"
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
        <Col xs={24} lg={8}>
          <Card title="Memory Distribution" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={memoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {memoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Recent Activity" size="small">
            <Timeline size="small">
              <Timeline.Item color="green">
                <Text type="secondary">2 min ago</Text>
                <br />
                Agent "Customer Support" processed 15 queries
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text type="secondary">5 min ago</Text>
                <br />
                Memory consolidation completed
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Text type="secondary">12 min ago</Text>
                <br />
                Risk alert: High context mismatch detected
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions">
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAgentModalVisible(true)}
              >
                Create Agent
              </Button>
              <Button
                icon={<SearchOutlined />}
                onClick={() => setCurrentPage("memory")}
              >
                Search Memories
              </Button>
              <Button
                icon={<BarChartOutlined />}
                onClick={() => setCurrentPage("analytics")}
              >
                View Analytics
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setCurrentPage("settings")}
              >
                System Settings
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="System Alerts">
            <Alert
              message="Performance Optimization"
              description="Agent 'Data Analysis' showing improved learning patterns"
              type="success"
              showIcon
              style={{ marginBottom: 8 }}
            />
            <Alert
              message="Memory Consolidation"
              description="Scheduled maintenance in 2 hours"
              type="info"
              showIcon
              style={{ marginBottom: 8 }}
            />
            <Alert
              message="Risk Alert"
              description="High context mismatch in Content Moderation Agent"
              type="warning"
              showIcon
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderAgentManagement = () => (
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

  const renderMemorySearch = () => (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Memory Search & Analytics</Title>
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
        <Col xs={24} lg={16}>
          <Card title={`Search Results (${mockMemories.length})`}>
            {mockMemories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Search Analytics" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Statistic title="Total Episodes" value={36470} />
              <Statistic title="Avg Recency Score" value={0.87} precision={2} />
              <Statistic title="Total Accesses" value={125430} />
              <Progress percent={92} status="active" strokeColor="#52c41a" />
              <Text type="secondary">Consolidation Health</Text>
            </Space>
          </Card>

          <Card title="Memory Distribution by Stage" size="small">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text>Working Memory</Text>
                <Progress percent={65} size="small" />
              </div>
              <div>
                <Text>Short-term</Text>
                <Progress percent={25} size="small" />
              </div>
              <div>
                <Text>Long-term</Text>
                <Progress percent={85} size="small" />
              </div>
              <div>
                <Text>Consolidated</Text>
                <Progress percent={45} size="small" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderBehavioralAnalytics = () => (
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

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <StatsCard
            title="Decision Success Rate"
            value="89.2%"
            change={{ direction: "up", value: 2.3, period: "vs last week" }}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard
            title="Avg Confidence"
            value="0.87"
            change={{ direction: "up", value: 0.05, period: "vs last week" }}
            icon={<TrophyOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard
            title="Risk Score"
            value="Medium"
            icon={<ExclamationCircleOutlined />}
            color="#fa8c16"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Decision Patterns Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="decisions"
                  stackId="1"
                  stroke="#1890ff"
                  fill="#1890ff"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="performance"
                  stackId="1"
                  stroke="#52c41a"
                  fill="#52c41a"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <RiskIndicator
            risk={{
              level: "medium",
              factors: {
                tunnelVision: 15,
                overConfidence: 32,
                staleness: 8,
                contextMismatch: 45,
              },
            }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Feedback Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={[
                  { category: "Effectiveness", score: 4.2 },
                  { category: "Relevance", score: 4.5 },
                  { category: "Accuracy", score: 4.1 },
                  { category: "Confidence", score: 3.9 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 5]} />
                <RechartsTooltip />
                <Bar dataKey="score" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Behavioral Feedback">
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Customer Support Agent</Text>
                <br />
                <Rate disabled defaultValue={4} style={{ fontSize: "14px" }} />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  Effectiveness: 4.2/5
                </Text>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div>
                <Text strong>Data Analysis Agent</Text>
                <br />
                <Rate disabled defaultValue={4} style={{ fontSize: "14px" }} />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  Relevance: 4.5/5
                </Text>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div>
                <Text strong>Content Moderation Agent</Text>
                <br />
                <Rate disabled defaultValue={3} style={{ fontSize: "14px" }} />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  Accuracy: 3.8/5
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderSettings = () => (
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

  const renderContent = () => {
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

  const AgentModal = () => (
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

  const FilterDrawer = () => (
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

  const AgentDetailModal = () => (
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
          <TabPane tab="Memory Stats" key="memory">
            <Card title="Memory Statistics">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Total Episodes"
                    value={selectedAgent.totalMemories}
                  />
                </Col>
                <Col span={8}>
                  <Statistic title="Avg Recency" value={0.89} precision={2} />
                </Col>
                <Col span={8}>
                  <Statistic title="Access Rate" value="15.2/day" />
                </Col>
              </Row>
              <ResponsiveContainer
                width="100%"
                height={200}
                style={{ marginTop: 16 }}
              >
                <LineChart data={performanceData.slice(-5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#1890ff"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabPane>
          <TabPane tab="Behavioral Analytics" key="behavioral">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Decision Success Rate" size="small">
                  <Progress
                    type="circle"
                    percent={Math.floor(selectedAgent.performance)}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Risk Assessment" size="small">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text>Tunnel Vision: </Text>
                      <Progress
                        percent={15}
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </div>
                    <div>
                      <Text>Over Confidence: </Text>
                      <Progress
                        percent={32}
                        size="small"
                        strokeColor="#fa8c16"
                      />
                    </div>
                    <div>
                      <Text>Staleness: </Text>
                      <Progress
                        percent={8}
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
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
            onClick={({ key }) => setCurrentPage(key)}
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
                {menuItems.find((item) => item.key === currentPage)?.label}
              </Breadcrumb.Item>
            </Breadcrumb>

            <Space size="large">
              <Badge count={3}>
                <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
              </Badge>
              <Dropdown overlay={userMenu} trigger={["click"]}>
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
