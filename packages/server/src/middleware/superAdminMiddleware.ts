import { getSuperAdminToken } from "@/config/context";
import { ControllerContext } from "@/entities/interfaces/controllers/context";

import { Next } from "hono";

const superAdminMiddleware: any = async (c: ControllerContext, next: Next) => {
  try {
    // Extract the authorization header
    const authorizationHeader = c.req.header("Authorization");

    if (!authorizationHeader) {
      throw new Error("Authorization header missing");
    }

    // Extract the token from the header
    const superAdminToken = authorizationHeader.split(" ")[1];

    if (superAdminToken !== getSuperAdminToken())
      return c.json({ message: "user not authenticated" }, 401);

    return await next();
  } catch (e) {
    return c.json({ message: "user not authenticated" }, 401);
  }
};

export default superAdminMiddleware;
