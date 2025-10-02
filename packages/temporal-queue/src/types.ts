import { Message } from "@meridiandb/shared/src/queue/entities/domain/queue";

export interface TemporalMessage extends Message {
  data: string[];
}
