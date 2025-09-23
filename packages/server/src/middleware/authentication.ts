import { AppContextKeys, getD1 } from "@/config/context";
import { ControllerContext } from "@/entities/interfaces/controllers/context";
import { getD1WithDrizzle } from "@/infrastructure/d1/connection";
import { createContainer } from "@/infrastructure/d1/container";
import { JWTPayload } from "@meridiandb/shared/src/entities/auth";
import { Next } from "hono";
import jsonwebtoken from "jsonwebtoken";

const authenticationMiddleWare = async (c: ControllerContext, next: Next) => {
  try {
    // Extract the authorization header
    const authorizationHeader = c.req.header("Authorization");

    if (!authorizationHeader) {
      throw new Error("Authorization header missing");
    }

    // Extract the token from the header
    const token = authorizationHeader.split(" ")[1];

    const container = createContainer(getD1WithDrizzle(getD1()));

    // Verify the token
    const decoded = container.accessService.verifyToken(token);
    console.log("token", decoded);

    c.set(AppContextKeys.ORG_ID, decoded.orgId);
    c.set(AppContextKeys.AGENT_ID, decoded.orgId);

    await next();
  } catch (e) {
    return c.json({ message: "user not authenticated" });
  }
};

export default authenticationMiddleWare;
