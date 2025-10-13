import {
  MemoryBehavioralUpdate,
  MemoryEpisode,
  MemoryEpisodeFilter,
  MemoryRetrievalRequest,
} from "@meridiandb/shared/src/entities/memory";
import { BaseServiceImpl } from "./base";
import AiAdapter from "@/adapters/ai";
import VectorizeRepository from "@/repositories/vector";
import { IMemoryService } from "@/entities/interfaces/services/memory";
import { getAgentId, getAgentRequestContext, getOrgId } from "@/config/context";
import { PaginatedResponse } from "@/entities/domain/dto";
import { temporalQueueClient } from "@/config/queues";
import { TemporalMessage } from "@meridiandb/shared/src/queue/entities/domain/queue";
import { IMemoryRepository } from "@/entities/interfaces/repositories/memory";

export class MemoryEpisodeService
  extends BaseServiceImpl<MemoryEpisode, MemoryEpisodeFilter>
  implements IMemoryService
{
  constructor(
    private memoryEpisodeRepository: IMemoryRepository,
    private aiAdapter: AiAdapter,
    private vectorize: VectorizeRepository
  ) {
    super(memoryEpisodeRepository);
  }

  async upsert(request: MemoryEpisode): Promise<MemoryEpisode | null> {
    let d1RecordId: string | null = null;

    request.organizationId = getOrgId();

    // allow agentId payload if it's defined ( payload from admin portal)
    // add it if the request coming from agent
    if (!request.agentId) {
      request.agentId = getAgentId();
    }

    try {
      // 2. Parallelize embedding generation and D1 upsert
      const [embeddings, created] = await Promise.all([
        this.aiAdapter.getUpsertVectorizeEmbeddings(request),
        this.memoryEpisodeRepository.create({ ...request }),
      ]);

      // 3. Validate D1 creation short-circuit and return null if creation failed
      if (!created?.id) {
        return null;
      }

      d1RecordId = created.id;

      // 4. Upsert to vectorize with retry logic
      let vectors: VectorizeVector[] = [];
      embeddings.data.forEach((v) => {
        vectors.push({
          id: created.id,
          values: v,
          metadata: { agentId: created.agentId },
        });
      });

      // 5. vectorize with local retry
      // ( should not be needed given vectorize architecture but why not, little-over engineering)
      const upsertedVectorize = await this.retryWithBackoff(
        () => this.vectorize.insert(vectors),
        { maxAttempts: 3 }
      );

      if (!upsertedVectorize) {
        throw new Error("Vectorize upsert failed");
      }

      return created;
    } catch (error) {
      // 5. Cleanup on failure
      if (d1RecordId) {
        await this.safeDelete(d1RecordId);
      }

      // 6. Log and handle appropriately
      console.error("Upsert failed:", error);

      // Depending on error type, you might want to retry or throw
      if (this.isRetryableError(error)) {
        return null;
      }

      return null;
    }
  }

  // Helper methods
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    options: { maxAttempts: number; delayMs?: number } = { maxAttempts: 3 }
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === options.maxAttempts || !this.isRetryableError(error)) {
          break;
        }

        // Exponential backoff
        const delay = (options.delayMs || 1000) * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  private async safeDelete(id: string): Promise<void> {
    try {
      await this.memoryEpisodeRepository.delete(id);
    } catch (error) {
      console.warn("Cleanup deletion failed:", error);
      // Log to monitoring system for manual cleanup
    }
  }

  private isRetryableError(error: any): boolean {
    // Network errors, timeouts, rate limits, etc.
    return (
      error.code === "NETWORK_ERROR" ||
      error.code === "TIMEOUT" ||
      error.status >= 500
    );
  }

  async searchSingleAgent(request: MemoryRetrievalRequest) {
    return this.searchMemories({
      ...request,
      filters: {
        agentId: getAgentRequestContext().AGENT_ID,
        stabilityThreshold: getAgentRequestContext().stabilityThreshold,
        successRate: getAgentRequestContext().successRate,
      },
    });
  }

  async searchMultiAgentsMemory(request: MemoryRetrievalRequest) {
    return this.searchMemories({
      ...request,
      filters: {
        stabilityThreshold: getAgentRequestContext().stabilityThreshold,
        successRate: getAgentRequestContext().successRate,
      },
    });
  }

  private async searchMemories({
    query,
    filters,
  }: {
    query: string;
    filters: MemoryEpisodeFilter;
  }): Promise<PaginatedResponse<MemoryEpisode> | null> {
    try {
      // Get embeddings for the query
      const queryEmbeddings =
        await this.aiAdapter.getUserQueryVectorizeEmbeddings(query);

      const agentId = getAgentRequestContext().AGENT_ID;

      // Search vector database with optional agent filter
      const searchOptions = { agentId: agentId };
      const matches = await this.vectorize.search(
        queryEmbeddings.data[0],
        searchOptions
      );

      // No matches found
      if (matches.count === 0) {
        return null;
      }

      // Extract matched IDs for database retrieval
      const matchedIds = matches.matches.map((match) => match.id);

      // Find memories with smart filtering (semantic, contextual, behavioral, temporal)
      const memories = await this.repository.find({
        ids: matchedIds,
        stabilityThreshold: filters.stabilityThreshold,
        successRate: filters.successRate,
        agentId: filters.agentId || agentId,
      });

      const temporalQueueMessage: TemporalMessage["data"] = {
        memories: memories.data.map((memory) => memory.id),
        agentId: agentId,
      };
      // Publish memories temporal feature updating events
      // to temporal queue.
      if (
        temporalQueueMessage.memories.length > 0 &&
        typeof temporalQueueMessage.agentId === "string"
      ) {
        await temporalQueueClient().publish(temporalQueueMessage);
      }
      return memories;
    } catch (error) {
      return null;
    }
  }

  async memoriesBehavioralUpdate(
    memoriesBehavioralUpdate: MemoryBehavioralUpdate
  ): Promise<boolean> {
    return this.memoryEpisodeRepository.behavioralUpdate(
      memoriesBehavioralUpdate
    );
  }
}
