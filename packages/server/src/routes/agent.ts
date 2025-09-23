import { getD1 } from "@/config/context";
import { ID_ROUTE, ROOT_ROUTE } from "@/config/routes";
import { AgentController } from "@/controllers/agent";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import authenticationMiddleWare from "@/middleware/authentication";
import {
  UpdateAgentRequestSchema,
  AgentFilterSchema,
  CreateAgentRequestSchema,
} from "@/validators/agent";
import { idParamSchema } from "@/validators/global";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const agentRoutes = new Hono();

const getAgentController = (): AgentController => {
  const container = createContainer(getD1WithDrizzle(getD1()));
  return new AgentController(container.agentService);
};

// Auth middleware
agentRoutes.use(authenticationMiddleWare);

agentRoutes.get(ROOT_ROUTE, zValidator("query", AgentFilterSchema), (c) =>
  getAgentController().list(c)
);

agentRoutes.put(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  zValidator("json", UpdateAgentRequestSchema),
  (c) => getAgentController().create(c)
);

agentRoutes.post(
  ROOT_ROUTE,
  zValidator("json", CreateAgentRequestSchema),
  (c) => getAgentController().create(c)
);

agentRoutes.delete(ID_ROUTE, zValidator("param", idParamSchema), (c) =>
  getAgentController().delete(c)
);

export { agentRoutes };
