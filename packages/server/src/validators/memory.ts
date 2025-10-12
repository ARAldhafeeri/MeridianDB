import { z } from "zod";

/**
 * Base entity schema
 */
export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Enums schemas
 */
export const AccessLevelSchema = z.enum(["PRIVATE", "SHARED", "PUBLIC"]);
export const MemoryStageSchema = z.enum([
  "ENCODING",
  "STORAGE",
  "RETRIEVAL",
  "CONSOLIDATION",
]);

/**
 * Memory Episode entity schema
 */
export const MemoryEpisodeSchema = BaseEntitySchema.extend({
  // Basic identification
  agentId: z.string(),
  content: z.string(),

  // Temporal features
  recencyScore: z.number().min(0).max(1),
  accessFrequency: z.number().min(0).max(1),
  lastAccessedAt: z.date().optional(),
  isFactual: z.boolean().default(false),
  isIrrelevant: z.boolean().default(false),

  // Contextual features
  context: z.string(),

  // Behavioral features
  successRate: z.number().min(0).max(1),

  // Access and stage
  accessLevel: AccessLevelSchema,
  stage: MemoryStageSchema,
});

/**
 * Create memory episode payload schema
 */
export const CreateMemoryEpisodeRequestSchema = z.object({
  // Basic identification
  agentId: z.string().optional(),
  content: z.string().min(1, "Content is required"),

  // Temporal features
  recencyScore: z.number().min(0).max(1).default(1),
  accessFrequency: z.number().min(0).max(1).default(0),
  lastAccessedAt: z.date().optional(),
  isFactual: z.boolean().default(false),
  isIrrelevant: z.boolean().default(false),

  // Contextual features
  context: z.string().min(1, "Context is required"),

  // Behavioral features
  successRate: z.number().min(0).max(1).default(0),
  positive: z.number().min(0).default(0),
  negative: z.number().min(0).default(0),

  // Access and stage
  accessLevel: AccessLevelSchema,
  stage: MemoryStageSchema,
});

/**
 * Memories Bheavioral update
 */

export const UpdateMemoriesBehavioralSchema = z.object({
  status: z.boolean(),
  memories: z.array(z.string()),
});

/**
 * Update memory episode payload schema
 */
export const UpdateMemoryEpisodeRequestSchema = z
  .object({
    // Basic identification
    agentId: z.string().min(1).optional(),
    content: z.string().min(1).optional(),

    // Temporal features
    recencyScore: z.number().min(0).max(1).optional(),
    accessFrequency: z.number().min(0).max(1).optional(),
    lastAccessedAt: z.date().optional(),
    isFactual: z.boolean().optional(),
    isIrrelevant: z.boolean().optional(),

    // Contextual features
    context: z.string().min(1).optional(),

    // Behavioral features
    successRate: z.number().min(0).max(1).optional(),

    // Access and stage
    accessLevel: AccessLevelSchema.optional(),
    stage: MemoryStageSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

/**
 * Memory retrieval request schema
 */
export const MemoryRetrievalRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

/**
 * Feature search request schema
 */
export const FeatureSearchRequestSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

/**
 * Feature search result schema
 */
export const FeatureSearchResultSchema = z.object({
  query: z.string(),
});

/**
 * Memory episode filter query parameters schema
 */
export const MemoryEpisodeFilterSchema = z.object({
  agentId: z.string().optional(),
  ids: z.array(z.string()).optional(),
  organizationId: z.string().optional(),
  environment: z.enum(["coding", "research", "conversation"]).optional(),
  taskType: z.enum(["problem_solving", "learning", "recall"]).optional(),
  isFactual: z.boolean().optional(),
  isIrrelevant: z.boolean().optional(),
  successRate: z.number().min(0).max(1).optional(),
  stabilityThreshold: z.number().min(0).max(1).optional(),
});

/**
 * Memory filter schema (empty for now as per interface)
 */
export const MemoryFilterSchema = z.object({});

// Type inference from schemas
export type MemoryEpisode = z.infer<typeof MemoryEpisodeSchema>;
export type CreateMemoryEpisodeRequest = z.infer<
  typeof CreateMemoryEpisodeRequestSchema
>;
export type UpdateMemoryEpisodeRequest = z.infer<
  typeof UpdateMemoryEpisodeRequestSchema
>;
export type MemoryRetrievalRequest = z.infer<
  typeof MemoryRetrievalRequestSchema
>;
export type FeatureSearchRequest = z.infer<typeof FeatureSearchRequestSchema>;
export type FeatureSearchResult = z.infer<typeof FeatureSearchResultSchema>;
export type MemoryEpisodeFilter = z.infer<typeof MemoryEpisodeFilterSchema>;
export type MemoryFilter = z.infer<typeof MemoryFilterSchema>;
export type AccessLevel = z.infer<typeof AccessLevelSchema>;
export type MemoryStage = z.infer<typeof MemoryStageSchema>;

// Optional: Schema for partial memory episode (useful for patches)
export const PartialMemoryEpisodeSchema = MemoryEpisodeSchema.partial();

// Optional: Schema for memory episode with optional fields (useful for responses)
export const MemoryEpisodeResponseSchema = MemoryEpisodeSchema.omit({
  // Remove any sensitive fields if needed
});

// Utility functions for validation
export const validateCreateMemoryEpisode = (data: unknown) =>
  CreateMemoryEpisodeRequestSchema.parse(data);
export const validateUpdateMemoryEpisode = (data: unknown) =>
  UpdateMemoryEpisodeRequestSchema.parse(data);
export const validateMemoryRetrieval = (data: unknown) =>
  MemoryRetrievalRequestSchema.parse(data);
export const validateFeatureSearch = (data: unknown) =>
  FeatureSearchRequestSchema.parse(data);
export const validateMemoryEpisodeFilter = (data: unknown) =>
  MemoryEpisodeFilterSchema.parse(data);

// Safe parse functions for error handling
export const safeParseCreateMemoryEpisode = (data: unknown) =>
  CreateMemoryEpisodeRequestSchema.safeParse(data);
export const safeParseUpdateMemoryEpisode = (data: unknown) =>
  UpdateMemoryEpisodeRequestSchema.safeParse(data);
export const safeParseMemoryRetrieval = (data: unknown) =>
  MemoryRetrievalRequestSchema.safeParse(data);
export const safeParseFeatureSearch = (data: unknown) =>
  FeatureSearchRequestSchema.safeParse(data);
export const safeParseMemoryEpisodeFilter = (data: unknown) =>
  MemoryEpisodeFilterSchema.safeParse(data);
