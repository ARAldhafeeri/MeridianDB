import { IAuthController } from "@/entities/interfaces/controllers/auth";
import { ControllerContext } from "@/entities/interfaces/controllers/context";
import {
  AgentAccessRequest,
  AuthLoginRequest,
} from "@/entities/interfaces/services/auth";
import AuthService from "@/services/auth";

export class AuthController implements IAuthController {
  constructor(private service: AuthService) {}

  protected handleError(
    error: Error,
    context: ControllerContext,
    operation: string
  ): Response {
    console.error(`Error in ${operation}:`, error);

    if (error.message.includes("not found")) {
      return context.json({ error: error.message }, 404);
    }

    if (
      error.message.includes("validation") ||
      error.message.includes("invalid")
    ) {
      return context.json({ error: error.message }, 400);
    }

    return context.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      500
    );
  }

  async login(context: ControllerContext): Promise<Response> {
    try {
      // Body is already validated by Hono middleware
      const validatedData = (context.req.valid as any)(
        "json"
      ) as AuthLoginRequest;
      const entity = await this.service.login(
        validatedData.username,
        validatedData.password
      );
      if (!entity.token)
        return context.json({ message: "incorrect username or password" }, 400);
      return context.json(entity, 201);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }

  async initSuperAdmin(context: ControllerContext): Promise<Response> {
    try {
      const adminEmail = context.env.ADMIN_EMAIL;
      const adminPassword = context.env.ADMIN_PASSWORD;
      await this.service.initSuperAdmin(adminEmail, adminPassword);
      return context.json(true, 201);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }

  async verifyAgentAccessToken(context: ControllerContext): Promise<Response> {
    try {
      const validatedData = (context.req.valid as any)(
        "json"
      ) as AgentAccessRequest;
      const refreshToken = await this.service.verifyAgentAccessToken(
        validatedData.token
      );
      if (!refreshToken) return context.json({ token: null }, 401);

      return context.json({ token: refreshToken }, 201);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }

  async verifyAgentRefreshToken(context: ControllerContext): Promise<Response> {
    try {
      const validatedData = (context.req.valid as any)(
        "json"
      ) as AgentAccessRequest;
      const refreshToken = await this.service.verifyAgentRefreshToken(
        validatedData.token
      );
      if (!refreshToken) return context.json({ token: null }, 401);

      return context.json({ token: refreshToken }, 201);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }
}
