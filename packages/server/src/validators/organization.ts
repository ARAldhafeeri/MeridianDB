import { z } from "zod";
import { paginationSchema } from "./global";

export const organizationCreateSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
});

export const organizationUpdateSchema = z.object({
  name: z.string().min(1, "Name must be non-empty").trim().optional(),
});

export const organizationFilterSchema = paginationSchema.extend({
  name: z.string().optional(),
});

export const organizationBulkCreateSchema = z
  .array(organizationCreateSchema)
  .min(1, "At least one organization is required");

export type OrganizationCreateRequest = z.infer<
  typeof organizationCreateSchema
>;
export type OrganizationUpdateRequest = z.infer<
  typeof organizationUpdateSchema
>;
export type OrganizationFilter = z.infer<typeof organizationFilterSchema>;
