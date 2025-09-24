import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
import { BaseRepository } from "./base";

/**
 * Primary memory repository (D1-based)
 */
export interface IMemoryRepository extends BaseRepository<MemoryEpisode> {}
