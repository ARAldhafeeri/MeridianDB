import z from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").trim(),
  role: z.enum(["admin", "user", "moderator"]).default("user"),
  isActive: z.boolean().default(true),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
