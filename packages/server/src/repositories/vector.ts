import {
  IVictorizeRepository,
  VectorizeQueryResult,
} from "@/entities/interfaces/repositories/vector";

class VectorizeRepository implements IVictorizeRepository {
  constructor(private vectorize: Vectorize) {}
  async search(query: number[]): Promise<VectorizeQueryResult> {
    const data = await this.vectorize.query(query);
    return data;
  }

  async insert(memories: VectorizeVector[]): Promise<string> {
    const data = await this.vectorize.upsert(memories);
    return data.mutationId;
  }
}

export default VectorizeRepository;
