import { MemoryEpisode } from "@meridiandb/shared/src/entities/memory";
import { BaseServiceImpl } from "./base";
import {
  MemoryEpisodeFilter,
  MemoryEpisodeRepository,
} from "@/repositories/memory";

export class MemoryEpisodeService
  extends BaseServiceImpl<MemoryEpisode, MemoryEpisodeFilter>
  implements MemoryEpisodeService
{
  constructor(memoryEpisodeRepository: MemoryEpisodeRepository) {
    super(memoryEpisodeRepository);
  }
}
