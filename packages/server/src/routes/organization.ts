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

const getOrgController = (): OrganizationController => {
  const container = createContainer(getD1WithDrizzle(getD1()));
  return new OrganizationController(container.organizationService);
};

// Routes with Zod validation middleware
organizationRoutes.post(
  ROOT_ROUTE,
  zValidator("json", organizationCreateSchema),
  getOrgController().create
);

organizationRoutes.get(
  ROOT_ROUTE,
  zValidator("query", organizationFilterSchema),
  getOrgController().list
);

organizationRoutes.get(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  getOrgController().getById
);

organizationRoutes.put(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  zValidator("json", organizationUpdateSchema),
  getOrgController().update
);

organizationRoutes.delete(
  ID_ROUTE,
  zValidator("param", idParamSchema),
  getOrgController().delete
);

organizationRoutes.post(
  BULK_ROUTE,
  zValidator("json", organizationBulkCreateSchema),
  getOrgController().bulkCreate
);

export { organizationRoutes };
