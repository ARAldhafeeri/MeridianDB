import { initSchema } from "@/config/db";
import { Context } from "hono";

export const initDBSchemaOrGetStatusController = async (c: Context) => {
  const status = await initSchema();
  return c.json(
    {
      status: status,
    },
    200
  );
};
