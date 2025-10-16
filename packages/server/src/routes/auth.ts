import { getD1 } from "@/config/context";
import { AUTH_ENDPOINTS } from "@/config/routes";
import { AuthController } from "@/controllers/auth";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  agentAccessAndRefreshSchema,
  initSuperAdminSchema,
  loginRequestSchema,
} from "@/validators/auth";

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

// init super admin securly with configurable token by the user
authRoutes.post(
  AUTH_ENDPOINTS.init,
  zValidator("json", initSuperAdminSchema),
  (c) => getAuthController().initSuperAdmin(c)
);

// agent refresh-token flow for client to interact with
// memory endpoints ( agent scope)
authRoutes.post(
  AUTH_ENDPOINTS.agent.access,
  zValidator("json", agentAccessAndRefreshSchema),
  (c) => getAuthController().verifyAgentAccessToken(c)
);

authRoutes.post(
  AUTH_ENDPOINTS.agent.refresh,
  zValidator("json", agentAccessAndRefreshSchema),
  (c) => getAuthController().verifyAgentRefreshToken(c)
);

export { authRoutes };
