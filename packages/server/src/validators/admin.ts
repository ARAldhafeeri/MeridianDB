import z from "zod";
import { paginationSchema } from "./global";

export const userCreateSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").trim(),
  role: z.enum(["admin", "user", "moderator"]).default("user"),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().min(1, "Name must be non-empty").trim().optional(),
  role: z.enum(["admin", "user", "moderator"]).optional(),
  isActive: z.boolean().optional(),
});

export const userFilterSchema = paginationSchema.extend({
  email: z.string().email("Invalid email format").optional(),
  name: z.string().optional(),
  role: z.enum(["admin", "user", "moderator"]).optional(),
  isActive: z
    .boolean()
    .transform((val: boolean | string) => val === true || val === "true")
    .optional(),
  createdAfter: z.string().datetime("Invalid date format").optional(),
  createdBefore: z.string().datetime("Invalid date format").optional(),
});

export type UserCreateRequest = z.infer<typeof userCreateSchema>;
export type UserUpdateRequest = z.infer<typeof userUpdateSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;
