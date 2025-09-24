import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
import { MemoryRetrievalRequest } from "../../domain/memory";
import { BaseService } from "./base";
import { PaginatedResponse } from "@/entities/domain/dto";

/**
 * Memory service with tabular operations
 */
export interface IMemoryService extends BaseService<MemoryEpisode> {
  /**
   * meridian-db retrieve operations:
   *  1. creates embeddings for the query.
   *  2. over-fetch results with configurable top-k from env variables.
   *  3. perform termpral, behavioral filtering
   *  4. return the results from d1.
   * @param request request to perform meridian-db retrieve operation
   *
   */
  search(
    request: MemoryRetrievalRequest
  ): Promise<PaginatedResponse<MemoryEpisode>>;

  /**
   * atomic federated db upserts with two scenarios:
   * 1. data is inserted successfuly in d1:
   *  a. create embeddings for the data.
   *  b. upsert the data in vectorize:
   *    i. upsert in vectorize is success : return memory.
   *    ii. upsert in vectorize is a failure: delete memory from d1 and return null
   * 2. data insert failed in d1:
   *  a. return null, no data will be vectorized.
   * This is the simplest coordination and syncing.
   * Enterprise should use queues on this operation for retry and exponential backoff.
   *
   * This method is used both in ai-agent rag - creating context.
   * in Admin portal.
   * content field in admin portal should be omitted and not included
   * in update op. Admin should create new memories instead to keep temporal dim intact.
   * @param request
   */
  upsert(request: MemoryEpisode): Promise<MemoryEpisode | null>;
  // multiMemoryUpsert(request: MemoryRetrievalRequest): Promise<MemoryEpisode[]>;
}
