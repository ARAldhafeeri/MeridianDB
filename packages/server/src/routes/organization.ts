import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { OrganizationController } from "@/controllers/organization";
import { createContainer } from "@/infrastructure/d1/container";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { getD1 } from "@/config/context";
import {
  organizationCreateSchema,
  organizationUpdateSchema,
  organizationFilterSchema,
  organizationBulkCreateSchema,
} from "@/validators/organization";
import { idParamSchema } from "@/validators/global";
import { BULK_ROUTE, ID_ROUTE, ROOT_ROUTE } from "@/config/routes";

const organizationRoutes = new Hono();

// Create controller instance
const container = createContainer(getD1WithDrizzle(getD1()));
const organizationController = new OrganizationController(
  container.organizationService
);

// Routes with Zod validation middleware
organizationRoutes.post(
  ROOT_ROUTE,
  zValidator("json", organizationCreateSchema),
  organizationController.create.bind(organizationController)
);

organizationRoutes.get(
  ROOT_ROUTE,
  zValidator("query", organizationFilterSchema),
  organizationController.list.bind(organizationController)
);

organizationRoutes.get(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  organizationController.getById.bind(organizationController)
);

organizationRoutes.put(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  zValidator("json", organizationUpdateSchema),
  organizationController.update.bind(organizationController)
);

organizationRoutes.delete(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  organizationController.delete.bind(organizationController)
);

organizationRoutes.post(
  BULK_ROUTE,
  zValidator("json", organizationBulkCreateSchema),
  organizationController.bulkCreate.bind(organizationController)
);

export { organizationRoutes };
