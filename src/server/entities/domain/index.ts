/**
 * Core system enums - simplified for tabular approach
 */
export enum MemoryStage {
  EPISODIC = "episodic", // New memories, high novelty
  CONSOLIDATING = "consolidating", // Being processed
  CONSOLIDATED = "consolidated", // Stable, high importance
  ARCHIVED = "archived", // Low access, preserved
}

export enum SimilarityType {
  SEMANTIC = "semantic",
  TEMPORAL = "temporal",
  CONTEXTUAL = "contextual",
  BEHAVIORAL = "behavioral",
}

export enum AccessLevel {
  PRIVATE = "private",
  ORGANIZATION = "organization",
  FEDERATED = "federated",
  PUBLIC = "public",
}
