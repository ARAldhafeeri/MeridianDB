import { BaseEntity } from "@meridiandb/shared/src/entities/base";
import { PaginationParams } from "@/entities/domain/dto";
import { BaseController } from "@/entities/interfaces/controllers/base";
import { ControllerContext } from "@/entities/interfaces/controllers/context";
import { IdParam, PaginationQuery } from "@/validators/global";
import { BaseService } from "@/entities/interfaces/services/base";

export abstract class BaseControllerImpl<
  T extends BaseEntity,
  TFilter = object,
  TService extends BaseService<T, TFilter> = BaseService<T, TFilter>
> implements BaseController
{
  constructor(protected service: TService) {}

  // Utility methods
  protected convertPaginationParams(query: PaginationQuery): PaginationParams {
    return {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

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

  // CRUD Implementation - These will be used with Hono middleware validation
  async create(context: ControllerContext): Promise<Response> {
    try {
      // Body is already validated by Hono middleware
      const validatedData = (context.req.valid as any)("json");
      const entity = await this.service.create(validatedData as T);
      return context.json(entity, 201);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }

  async getById(context: ControllerContext): Promise<Response> {
    try {
      // Param is already validated by Hono middleware
      const { id } = (context.req.valid as any)("param") as IdParam;
      const entity = await this.service.getById(id);
      return context.json(entity);
    } catch (error) {
      return this.handleError(error as Error, context, "getById");
    }
  }

  async list(context: ControllerContext): Promise<Response> {
    try {
      // Query params are already validated by Hono middleware
      const paginationQuery = (context.req.valid as any)(
        "query"
      ) as PaginationQuery & TFilter;

      // Separate pagination from filter params
      const { page, limit, sortBy, sortOrder, ...filterParams } =
        paginationQuery;
      const paginationParams = this.convertPaginationParams({
        page,
        limit,
        sortBy,
        sortOrder,
      });

      const result = await this.service.list(
        filterParams as TFilter,
        paginationParams
      );

      return context.json(result);
    } catch (error) {
      return this.handleError(error as Error, context, "list");
    }
  }

  async update(context: ControllerContext): Promise<Response> {
    try {
      // Both param and body are already validated by Hono middleware
      const { id } = (context.req.valid as any)("param") as IdParam;
      const validatedData = (context.req.valid as any)("json");

      const entity = await this.service.update(
        id,
        validatedData as Omit<T, keyof BaseEntity>
      );
      return context.json(entity);
    } catch (error) {
      return this.handleError(error as Error, context, "update");
    }
  }

  async delete(context: ControllerContext): Promise<Response> {
    try {
      // Param is already validated by Hono middleware
      const { id } = (context.req.valid as any)("param") as IdParam;
      const success = await this.service.delete(id);

      if (!success) {
        return context.json({ error: "Failed to delete entity" }, 500);
      }

      return context.json({ message: "Entity deleted successfully" });
    } catch (error) {
      return this.handleError(error as Error, context, "delete");
    }
  }

  // Optional bulk operations
  async bulkCreate(context: ControllerContext): Promise<Response> {
    try {
      const validatedData = (context.req.valid as any)("json");
      const results: T[] = [];
      const errors: { index: number; error: string }[] = [];

      for (let i = 0; i < validatedData.length; i++) {
        try {
          const entity = await this.service.create(validatedData[i]);
          results.push(entity);
        } catch (error) {
          errors.push({ index: i, error: (error as Error).message });
        }
      }

      return context.json({
        created: results,
        errors: errors,
        summary: {
          total: validatedData.length,
          successful: results.length,
          failed: errors.length,
        },
      });
    } catch (error) {
      return this.handleError(error as Error, context, "bulkCreate");
    }
  }
}
