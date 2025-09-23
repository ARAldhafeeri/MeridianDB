import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { OrganizationController } from "@/controllers/organization";
import { createContainer } from "@/infrastructure/d1/container";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { getD1 } from "@/config/context";
import {
  organizationUpdateSchema,
  organizationFilterSchema,
} from "@/validators/organization";
import { idParamSchema } from "@/validators/global";
import { ID_ROUTE, ROOT_ROUTE } from "@/config/routes";
import authenticationMiddleWare from "@/middleware/authentication";

const organizationRoutes = new Hono();

const getOrgController = (): OrganizationController => {
  const container = createContainer(getD1WithDrizzle(getD1()));
  return new OrganizationController(container.organizationService);
};

// Auth middleware
organizationRoutes.use(authenticationMiddleWare);

// Routes with Zod validation middleware

organizationRoutes.get(
  ROOT_ROUTE,
  zValidator("query", organizationFilterSchema),
  (c) => getOrgController().list(c)
);

organizationRoutes.put(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  zValidator("json", organizationUpdateSchema),
  (c) => getOrgController().update(c)
);

export { organizationRoutes };
