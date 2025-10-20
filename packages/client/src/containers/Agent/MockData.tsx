// Mock UI data for agents based on the correct entity
export const mockAgents = [
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
    // AgentMemoriesFeaturesConfig properties
    stabilityThreshold: 0.85,
    halfLifeHours: 24,
    timeWeight: 0.7,
    frequencyWeight: 0.3,
    decayCurve: "exponential",
    successRate: 0.92,
    isActive: true,
    metadata: {
      category: "customer_service",
      maxConcurrentSessions: 100,
      supportedLanguages: ["en", "es", "fr"]
    }
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
    halfLifeHours: 48,
    timeWeight: 0.6,
    frequencyWeight: 0.4,
    decayCurve: "hybird",
    successRate: 0.68,
    isActive: false,
    metadata: {
      category: "analytics",
      dataRetentionDays: 30,
      privacyLevel: "high"
    }
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
    halfLifeHours: 12,
    timeWeight: 0.8,
    frequencyWeight: 0.2,
    decayCurve: "exponential",
    successRate: 0.95,
    isActive: true,
    metadata: {
      category: "document_processing",
      maxFileSize: "10MB",
      supportedFormats: ["pdf", "docx", "txt"]
    }
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
    halfLifeHours: 36,
    timeWeight: 0.5,
    frequencyWeight: 0.5,
    decayCurve: "polynomial",
    successRate: 0.81,
    isActive: true,
    metadata: {
      category: "research",
      citationStyle: "apa",
      maxSources: 20
    }
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
    halfLifeHours: 72,
    timeWeight: 0.4,
    frequencyWeight: 0.6,
    decayCurve: "hybird",
    successRate: 0.59,
    isActive: false,
    metadata: {
      category: "workflow",
      maxConcurrentWorkflows: 50,
      timeoutMinutes: 60
    }
  }
];