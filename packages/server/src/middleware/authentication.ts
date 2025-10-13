import { AppContextKeys, getD1 } from "@/config/context";
import { ControllerContext } from "@/entities/interfaces/controllers/context";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import { Next } from "hono";

const authenticationMiddleWare: any = async (
  c: ControllerContext,
  next: Next
) => {
  try {
    // Extract the authorization header
    const authorizationHeader = c.req.header("Authorization");

    if (!authorizationHeader) {
      return c.json({ message: "user not authenticated" }, 401);
    }

    // Extract the token from the header
    const token = authorizationHeader.split(" ")[1];

    const container = createContainer(getD1WithDrizzle(getD1()));

    // Verify the token
    const decoded = container.accessService.verifyToken(token);

    // not admin token, agent token
    if (!decoded[AppContextKeys.ADMIN_ID]) {
      return c.json({ message: "Can't use agent token" }, 401);
    }
    c.set(AppContextKeys.ORG_ID, decoded[AppContextKeys.ORG_ID]);
    c.set(AppContextKeys.ADMIN_ID, decoded[AppContextKeys.ADMIN_ID]);

    return await next();
  } catch (e) {
    return c.json({ message: "user not authenticated" }, 401);
  }
};

export default authenticationMiddleWare;
