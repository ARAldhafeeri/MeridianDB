import {
  MemoryEpisode,
  MemoryEpisodeFilter,
  MemoryRetrievalResult,
} from "@meridiandb/shared/src/entities/memory";
import { BaseServiceImpl } from "./base";
import { MemoryEpisodeRepository } from "@/repositories/memory";
import AiAdapter from "@/adapters/ai";
import VectorizeRepository from "@/repositories/vector";
import { IMemoryService } from "@/entities/interfaces/services/memory";
import { getAgentRequestContext } from "@/config/context";
import { PaginatedResponse } from "@/entities/domain/dto";

export class MemoryEpisodeService
  extends BaseServiceImpl<MemoryEpisode, MemoryEpisodeFilter>
  implements IMemoryService
{
  constructor(
    private memoryEpisodeRepository: MemoryEpisodeRepository,
    private aiAdapter: AiAdapter,
    private vectorize: VectorizeRepository
  ) {
    super(memoryEpisodeRepository);
  }

  async upsert(request: MemoryEpisode): Promise<MemoryEpisode | null> {
    let d1RecordId: string | null = null;

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
      const vectorizeData = [
        {
          id: created.id,
          values: embeddings.data,
          metadata: { agentId: created.agentId },
        },
      ];

      // 5. vectorize with local retry
      // ( should not be needed given vectorize architecture but why not, little-over engineering)
      const upsertedVectorize = await this.retryWithBackoff(
        () => this.vectorize.insert(vectorizeData),
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

  async searchSingleAgent(request: MemoryRetrievalResult) {
    // get maches from vectorize
    const queryEmbeddings =
      await this.aiAdapter.getUserQueryVectorizeEmbeddings(request.query);

    const matches = await this.vectorize.search(queryEmbeddings.data, {
      agentId: getAgentRequestContext().agentId,
    });

    // no matches
    if (matches.count === 0) {
      return null;
    }

    // d1 result filters for  reterival temporal, behavioral , contextual
    // with smart filtering semantic , contextual, beahvioral, temporal
    return this.repository.find({
      ids: matches.matches.map((match) => match.id),
      stabilityThreshold: getAgentRequestContext().stabilityThreshold,
      successRate: getAgentRequestContext().successRate,
      agentId: getAgentRequestContext().agentId,
    });
  }

  async searchMultiAgentsMemory(
    request: MemoryRetrievalResult
  ): Promise<PaginatedResponse<MemoryEpisode> | null> {
    // get maches from vectorize
    const queryEmbeddings =
      await this.aiAdapter.getUserQueryVectorizeEmbeddings(request.query);

    const matches = await this.vectorize.search(queryEmbeddings.data);

    // no matches
    if (matches.count === 0) {
      return null;
    }

    // d1 result filters for  reterival temporal, behavioral , contextual
    // with smart filtering semantic , contextual, beahvioral, temporal
    return this.repository.find({
      ids: matches.matches.map((match) => match.id),
      stabilityThreshold: getAgentRequestContext().stabilityThreshold,
      successRate: getAgentRequestContext().successRate,
    });
  }
}
