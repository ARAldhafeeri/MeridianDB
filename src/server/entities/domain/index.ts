/**
 * Core system enums and constants
 */
/**
 * Types of node stated by the AI agent
 * refined and controlled by human-in-the-loop
 * via the admin dashboard
 */
export enum NodeType {
  CONCEPT = "concept",
  ENTITY = "entity",
  EVENT = "event",
  AGENT = "agent",
  MEMORY = "memory",
  CONTEXT = "context",
}

/**
 * Edge type stated by the AI agent
 * refined and controlled by human-in-the-loop
 * via the admin dashboard
 */
export enum EdgeType {
  // node A relates to node B
  RELATES_TO = "relates_to",
  // node A caused by node A
  CAUSED_BY = "caused_by",
  // node A and it's sub graph is similar to node B
  SIMILAR_TO = "similar_to",
  // node A drived from node B
  DERIVES_FROM = "derives_from",
  // node A is temporal next to node B
  TEMPORAL_NEXT = "temporal_next",
  // node A is contextual in node B
  CONTEXTUAL_IN = "contextual_in",
  // node B is a result from agent learning node A
  AGENT_LEARNED = "agent_learned",
}

/**
 * Memory consolidation stage stated by AI agent
 * refined and controlled by human-in-the-loop
 * via the admin dashboard
 */
export enum ConsolidationStage {
  EPISODIC = "episodic",
  REPLAY = "replay",
  CONSOLIDATING = "consolidating",
  CONSOLIDATED = "consolidated",
  ARCHIVED = "archived",
}

/**
 * Classify the similarity within the system.
 * System response will be all of them.
 */
export enum SimilarityType {
  SEMANTIC = "semantic",
  TEMPORAL = "temporal",
  CONTEXTUAL = "contextual",
  BEHAVIORAL = "behavioral",
}

/**
 * Access level for gates between agents and memory sharing.
 */
export enum AccessLevel {
  PRIVATE = "private",
  ORGANIZATION = "organization",
  FEDERATED = "federated",
  PUBLIC = "public",
}
