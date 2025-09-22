import {
  sqliteTable,
  text,
  real,
  integer,
  foreignKey,
  index,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
  version: integer("version").default(1),
});

export const admins = sqliteTable(
  "admins",
  {
    id: text("id").primaryKey(),
    organizationId: text("organizationId").notNull(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull().unique(),
    salt: text("salt").notNull(),
    hash: text("hash").notNull(),
    createdAt: text("createdAt").notNull(),
    updatedAt: text("updatedAt").notNull(),
    version: integer("version").default(1),
  },
  (table) => [
    index("idx_admins_org").on(table.organizationId),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "admins_organization_id_fk",
    }).onDelete("cascade"),
  ]
);

export const agents = sqliteTable(
  "agents",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    accessToken: text("accessToken"),
    decayFactor: real("decayFactor").default(1.0),
    failureRate: real("failureRate").default(1.0),
    isActive: integer({ mode: "boolean" }).default(false),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
    version: integer("version").default(1),
  },
  (table) => [
    index("idx_agents_org").on(table.organizationId),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "agents_organization_id_fk",
    }).onDelete("cascade"),
  ]
);

export const memoryEpisodes = sqliteTable(
  "memory_episodes",
  {
    id: text("id").primaryKey(),
    agentId: text("agentId").notNull(),
    organizationId: text("organizationId").notNull(),
    content: text("content").notNull(),
    conceptTags: text("conceptTags"),
    recencyScore: real("recencyScore").default(1.0),
    accessFrequency: integer("accessFrequency").default(0),
    lastAccessedAt: text("lastAccessedAt"),
    isFactual: integer("isFactual", { mode: "boolean" }).default(false),
    isIrrelevant: integer("isIrrelevant", { mode: "boolean" }).default(false),
    environment: text("environment", {
      enum: ["coding", "research", "conversation"],
    }),
    taskType: text("taskType", {
      enum: ["problem_solving", "learning", "recall"],
    }),
    extra: text("extra"),
    successRate: real("successRate").default(0.0),
    positive: integer("positive").default(0),
    negative: integer("negative").default(0),
    createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updatedAt").default(sql`CURRENT_TIMESTAMP`),
    version: integer("version").default(1),
  },
  (table) => [
    index("idx_memory_agent_org").on(table.agentId, table.organizationId),
    index("idx_memory_recency").on(table.recencyScore),
    index("idx_memory_access").on(table.accessFrequency),
    index("idx_success_rate").on(table.successRate),
    foreignKey({
      columns: [table.agentId],
      foreignColumns: [agents.id],
      name: "memory_episodes_agent_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "memory_episodes_organization_id_fk",
    }).onDelete("cascade"),
  ]
);
