export const TABLES = {
  agents: "agents",
  admins: "admins",
  memories: "memories",
  organizations: "organizations",
} as const;

export const TABLE_NAMES = Object.values(TABLES);

// Schema definitions
export const SCHEMAS = {
  [TABLES.organizations]: `
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tier TEXT CHECK(tier IN ('free', 'pro', 'enterprise')),
      quotas TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      version INTEGER DEFAULT 1
    )
  `,

  [TABLES.admins]: `
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      firstName TEXT,
      lastName TEXT,
      email TEXT NOT NULL UNIQUE,
      salt TEXT NOT NULL,
      hash TEXT NOT NULL,
      organizationId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `,

  [TABLES.agents]: `
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      organizationId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      capabilities TEXT NOT NULL,
      stabilityThreshold REAL DEFAULT 0.7,
      successRate REAL DEFAULT 0.0,
      isActive INTEGER DEFAULT 1,
      metadata TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `,

  [TABLES.memories]: `
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      agentId TEXT NOT NULL,
      organizationId TEXT NOT NULL,
      content TEXT NOT NULL,
      recencyScore REAL DEFAULT 1.0,
      accessFrequency REAL DEFAULT 0.0,
      lastAccessedAt TEXT,
      factual INTEGER DEFAULT 0,
      irrelavent INTEGER DEFAULT 0,
      context TEXT,
      successRate REAL DEFAULT 0.0,
      accessLevel TEXT CHECK(accessLevel IN ('private', 'shared', 'public')) DEFAULT 'private',
      stage TEXT CHECK(stage IN ('active', 'archived', 'deleted')) DEFAULT 'active',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      FOREIGN KEY (agentId) REFERENCES agents(id) ON DELETE CASCADE,
      FOREIGN KEY (organizationId) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `,
} as const;

// Index definitions for better performance
export const INDEXES = {
  [TABLES.organizations]: [
    "CREATE INDEX IF NOT EXISTS idx_organizations_tier ON organizations(tier)",
    "CREATE INDEX IF NOT EXISTS idx_organizations_created ON organizations(createdAt)",
  ],

  [TABLES.admins]: [
    "CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)",
    "CREATE INDEX IF NOT EXISTS idx_admins_organization ON admins(organizationId)",
    "CREATE INDEX IF NOT EXISTS idx_admins_created ON admins(createdAt)",
  ],

  [TABLES.agents]: [
    "CREATE INDEX IF NOT EXISTS idx_agents_organization ON agents(organizationId)",
    "CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(isActive)",
    "CREATE INDEX IF NOT EXISTS idx_agents_created ON agents(createdAt)",
  ],

  [TABLES.memories]: [
    "CREATE INDEX IF NOT EXISTS idx_memories_agent ON memories(agentId)",
    "CREATE INDEX IF NOT EXISTS idx_memories_organization ON memories(organizationId)",
    "CREATE INDEX IF NOT EXISTS idx_memories_recency ON memories(recencyScore)",
    "CREATE INDEX IF NOT EXISTS idx_memories_factual ON memories(factual)",
    "CREATE INDEX IF NOT EXISTS idx_memories_irrelavent ON memories(irrelavent)",
    "CREATE INDEX IF NOT EXISTS idx_memories_success_rate ON memories(successRate)",
    "CREATE INDEX IF NOT EXISTS idx_memories_stage ON memories(stage)",
    "CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(createdAt)",
    "CREATE INDEX IF NOT EXISTS idx_memories_last_accessed ON memories(lastAccessedAt)",
  ],
} as const;
