import {
  MemoryBehavioralUpdate,
  MemoryEpisode,
  MemoryEpisodeFilter,
} from "@meridiandb/shared/src/entities/memory";
import { BaseControllerImpl } from "./base";
import { ControllerContext } from "@/entities/interfaces/controllers/context";
import { MemoryEpisodeService } from "@/services/memory";
import { MemoryRetrievalRequest } from "@/validators/memory";

export class MemoryController extends BaseControllerImpl<
  MemoryEpisode,
  MemoryEpisodeFilter,
  MemoryEpisodeService
> {
  constructor(service: MemoryEpisodeService) {
    super(service);
  }

  // upsert method for meridiandb memory
  async create(context: ControllerContext): Promise<Response> {
    try {
      // Body is already validated by Hono middleware
      const validatedData = (context.req.valid as any)("json");
      const entity = await this.service.upsert(validatedData as MemoryEpisode);
      if (!entity)
        return context.json({ message: "failed to create memory" }, 400);
      return context.json(entity, 201);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }

  // search single agent
  async searchSingleAgent(context: ControllerContext): Promise<Response> {
    try {
      // Body is already validated by Hono middleware
      const validatedData = (context.req.valid as any)("json");
      const entity = await this.service.searchSingleAgent(
        validatedData as MemoryRetrievalRequest
      );
      if (!entity) return context.json(entity, 400);
      return context.json(entity, 200);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }

  // search multi agents
  async searchMultiAgent(context: ControllerContext): Promise<Response> {
    try {
      // Body is already validated by Hono middleware
      const validatedData = (context.req.valid as any)("json");
      const entity = await this.service.searchMultiAgentsMemory(
        validatedData as MemoryRetrievalRequest
      );
      if (!entity) return context.json(entity, 400);
      return context.json(entity, 200);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }

  // behavioral update request
  async behavioralUpdate(context: ControllerContext): Promise<Response> {
    try {
      // Body is already validated by Hono middleware
      const validatedData = (context.req.valid as any)("json");
      const entity = await this.service.memoriesBehavioralUpdate(
        validatedData as MemoryBehavioralUpdate
      );
      if (!entity) return context.json(entity, 400);
      return context.json(entity, 200);
    } catch (error) {
      return this.handleError(error as Error, context, "create");
    }
  }
}
