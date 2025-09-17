import { BaseEntity } from "./base";
/**
 * Memory episode for consolidation
 */
export interface MemoryEpisode extends BaseEntity {
  readonly memoryId: string; // d1 id of memory
  readonly content: string; // content to embed;
}

// define result, request
