import { getD1 } from "@/config/context";
import {
  AGENT_MEMORY_BEHAVIORAL,
  AGENT_SEARCH_MULTI,
  AGENT_SEARCH_SINGLE,
  ID_ROUTE,
  ROOT_ROUTE,
} from "@/config/routes";
import { MemoryController } from "@/controllers/memory";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import agentAuthMiddleware from "@/middleware/agentAuth";
import authenticationMiddleWare from "@/middleware/authentication";
import { idParamSchema, paginationSchema } from "@/validators/global";
import {
  CreateMemoryEpisodeRequestSchema,
  MemoryFilterSchema,
  MemoryRetrievalRequestSchema,
  UpdateMemoriesBehavioralSchema,
} from "@/validators/memory";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const memoryAdminPortalRoutes = new Hono();

const memoryAgentRoutes = new Hono();

const getMemoryController = (): MemoryController => {
  const container = createContainer(getD1WithDrizzle(getD1()));
  return new MemoryController(container.memoryEpisodeService);
};

// auth middleware

memoryAdminPortalRoutes.use(authenticationMiddleWare);
memoryAgentRoutes.use(agentAuthMiddleware);

// admin portal routes
memoryAdminPortalRoutes.get(
  ROOT_ROUTE,
  zValidator("query", paginationSchema),
  (c) => getMemoryController().list(c)
);

memoryAdminPortalRoutes.post(
  ROOT_ROUTE,
  zValidator("json", CreateMemoryEpisodeRequestSchema),
  (c) => getMemoryController().create(c)
);

// TODO: update need to be implemented same as upsert
// memoryRoutes.put(
//   ID_ROUTE,
//   zValidator("param", idParamSchema),
//   zValidator("json", UpdateMemoryEpisodeRequestSchema)
// );

// agent routes
memoryAgentRoutes.post(
  ROOT_ROUTE,
  zValidator("json", CreateMemoryEpisodeRequestSchema),
  (c) => getMemoryController().create(c)
);

memoryAgentRoutes.delete(ID_ROUTE, zValidator("param", idParamSchema), (c) =>
  getMemoryController().delete(c)
);

memoryAgentRoutes.post(
  AGENT_MEMORY_BEHAVIORAL,
  zValidator("json", UpdateMemoriesBehavioralSchema),

  (c) => getMemoryController().behavioralUpdate(c)
);

memoryAgentRoutes.post(
  AGENT_SEARCH_SINGLE,
  zValidator("json", MemoryRetrievalRequestSchema),
  (c) => getMemoryController().searchSingleAgent(c)
);

memoryAgentRoutes.post(
  AGENT_SEARCH_MULTI,
  zValidator("json", MemoryRetrievalRequestSchema),
  (c) => getMemoryController().searchSingleAgent(c)
);

export { memoryAdminPortalRoutes, memoryAgentRoutes };
