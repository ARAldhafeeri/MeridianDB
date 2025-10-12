import {
  MemoryBehavioralUpdate,
  MemoryEpisode,
} from "@meridiandb/shared/src/entities/memory";
import { BaseRepository } from "./base";
import { MemoryEpisodeFilter } from "@/validators/memory";

/**
 * Primary memory repository (D1-based)
 */
export interface IMemoryRepository
  extends BaseRepository<MemoryEpisode, MemoryEpisodeFilter> {
  behavioralUpdate(
    memoriesBehavioralUpdate: MemoryBehavioralUpdate
  ): Promise<boolean>;
}
