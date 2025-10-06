import { getEmbeddingModelName } from "@/config/context";
import {
  EmbeddingResponse,
  IAiAdapter,
} from "@/entities/interfaces/adapters/ai";
import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";

class AiAdapter implements IAiAdapter {
  constructor(private ai: Ai) {}

  async getUpsertVectorizeEmbeddings(
    memories: MemoryEpisode
  ): Promise<EmbeddingResponse> {
    return this.ai.run(getEmbeddingModelName(), {
      text: [memories.content, memories.context],
    });
  }

  async getUserQueryVectorizeEmbeddings(
    query: string
  ): Promise<EmbeddingResponse> {
    return this.ai.run(getEmbeddingModelName(), { text: [query] });
  }
}

export default AiAdapter;
