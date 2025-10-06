import z from "zod";

/**
 * Base entity schema (assuming this exists elsewhere)
 * This would need to be defined based on your BaseEntity interface
 */
export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * AI Agent entity schema
 */
export const AgentSchema = BaseEntitySchema.extend({
  organizationId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  capabilities: z.array(z.string()),
  stabilityThreshold: z.number().min(0).max(1),
  successRate: z.number().min(0).max(1),
  isActive: z.boolean(),
  metadata: z.object(),
  halfLifeHours: z.number(),
  timeWeight: z.number(),
  frequencyWeight: z.number(),
  decayCurve: z.enum(["exponential", "hybird", "polynomial"]),
});

/**
 * Create agent payload schema
 */
export const CreateAgentRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  capabilities: z
    .array(z.string())
    .min(1, "At least one capability is required"),
  learningRate: z.number().min(0).max(1).optional(),
  stabilityThreshold: z.number().min(0).max(1).optional(),
  metadata: z.object().optional(),
});

/**
 * Update agent payload schema
 */
export const UpdateAgentRequestSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    capabilities: z.array(z.string()).min(1).optional(),
    learningRate: z.number().min(0).max(1).optional(),
    stabilityThreshold: z.number().min(0).max(1).optional(),
    metadata: z.object().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

/**
 * Agent filter query parameters schema
 */
export const AgentFilterSchema = z
  .object({
    organizationId: z.string().optional(),
    name: z.string().optional(),
    isActive: z.boolean().optional(),
    capabilities: z.array(z.string()).optional(),
    createdAfter: z.date().optional(),
    createdBefore: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.createdAfter && data.createdBefore) {
        return data.createdAfter <= data.createdBefore;
      }
      return true;
    },
    {
      message: "createdAfter must be before or equal to createdBefore",
    }
  );

// Type inference from schemas
export type Agent = z.infer<typeof AgentSchema>;
export type CreateAgentRequest = z.infer<typeof CreateAgentRequestSchema>;
export type UpdateAgentRequest = z.infer<typeof UpdateAgentRequestSchema>;
export type AgentFilter = z.infer<typeof AgentFilterSchema>;

// Optional: Schema for partial agent (useful for patches)
export const PartialAgentSchema = AgentSchema.partial();

// Optional: Schema for agent with optional fields (useful for responses)
export const AgentResponseSchema = AgentSchema.omit({
  // Remove any sensitive fields if needed
});

// Utility functions for validation
export const validateCreateAgent = (data: unknown) =>
  CreateAgentRequestSchema.parse(data);
export const validateUpdateAgent = (data: unknown) =>
  UpdateAgentRequestSchema.parse(data);
export const validateAgentFilter = (data: unknown) =>
  AgentFilterSchema.parse(data);

// Safe parse functions for error handling
export const safeParseCreateAgent = (data: unknown) =>
  CreateAgentRequestSchema.safeParse(data);
export const safeParseUpdateAgent = (data: unknown) =>
  UpdateAgentRequestSchema.safeParse(data);
export const safeParseAgentFilter = (data: unknown) =>
  AgentFilterSchema.safeParse(data);
