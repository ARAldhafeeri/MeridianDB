import { getTopK } from "@/config/context";
import {
  IVictorizeRepository,
  VectorizeMetaDataFilter,
  VectorizeQueryResult,
} from "@/entities/interfaces/repositories/vector";

class VectorizeRepository implements IVictorizeRepository {
  constructor(private vectorize: Vectorize) {}
  async search(
    query: number[],
    filter?: VectorizeMetaDataFilter
  ): Promise<VectorizeQueryResult> {
    if (filter) {
      return this.vectorize.query(query, {
        topK: getTopK(),
        filter: filter as any,
      });
    } else {
      return this.vectorize.query(query);
    }
  }

  async insert(memories: VectorizeVector[]): Promise<string> {
    const data = await this.vectorize.upsert(memories);
    return data.mutationId;
  }
}

export default VectorizeRepository;
