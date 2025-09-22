import { getD1 } from "@/config/context";
import { AUTH_ENDPOINTS } from "@/config/routes";
import { AuthController } from "@/controllers/auth";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { loginRequestSchema } from "@/validators/auth";
const authRoutes = new Hono();

const getAuthController = () => {
  const container = createContainer(getD1WithDrizzle(getD1()));

  return new AuthController(container.authService);
};

authRoutes.post(
  AUTH_ENDPOINTS.login,
  zValidator("json", loginRequestSchema),
  (c) => getAuthController().login(c)
);

authRoutes.get(AUTH_ENDPOINTS.init, (c) =>
  getAuthController().initSuperAdmin(c)
);

export { authRoutes };
