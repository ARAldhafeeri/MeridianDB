import { AppContextKeys, getD1 } from "@/config/context";
import { ControllerContext } from "@/entities/interfaces/controllers/context";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import { Next } from "hono";

const agentAuthMiddleware: any = async (c: ControllerContext, next: Next) => {
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

    c.set(AppContextKeys.AGENT_REQUEST_CONTEXT, decoded);

    return await next();
  } catch (e) {
    return c.json({ message: "user not authenticated" }, 401);
  }
};

export default agentAuthMiddleware;
