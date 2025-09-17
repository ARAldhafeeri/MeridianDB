import type {
  IVectorizeClient,
  VectorizeQueryResult,
  VectorizeUpsertResult,
  VectorizeVector,
  VectorizeQueryOptions,
  VectorizeMatch,
} from "@/entities/interfaces/adapters/vectorize";

class VectorizeClient implements IVectorizeClient {
  constructor(private readonly vectorize: VectorizeIndex) {}

  async query(
    vector: number[],
    opts?: VectorizeQueryOptions
  ): Promise<VectorizeQueryResult> {
    try {
      const result = await this.vectorize.query(vector, opts);
      return {
        success: true,
        matches: result.matches as VectorizeMatch[],
        count: result.count,
      };
    } catch (error) {
      return {
        success: false,
        matches: [],
      };
    }
  }

  async upsert(vectors: VectorizeVector[]): Promise<VectorizeUpsertResult> {
    try {
      const result = await this.vectorize.upsert(vectors);
      return {
        success: true,
        count: result.count,
        ids: result.ids,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }

  async delete(ids: string[]): Promise<{ success: boolean }> {
    try {
      await this.vectorize.deleteByIds(ids);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

export const getVectorizeClient = (
  vectorize: VectorizeIndex
): IVectorizeClient => new VectorizeClient(vectorize);
