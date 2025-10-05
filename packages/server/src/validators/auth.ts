import z from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required").trim(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const agentAccessAndRefreshSchema = z.object({
  token: z.string("Invalid token"),
});
