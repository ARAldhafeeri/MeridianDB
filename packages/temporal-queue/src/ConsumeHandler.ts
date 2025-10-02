import { IConsumeHandler } from "@meridiandb/shared/src/queue/entities/interfaces/IRequestHandler";
import { TemporalMessage } from "types";

class ConsumerHandler implements IConsumeHandler {
  /**
   * Update multiple messages temporal features with effecient d1 query.
   * @param messages queue messages with temporal feature data
   */
  async handle(messages: TemporalMessage[]): Promise<void> {
    Promise.race([messages]);
  }
}
export default ConsumerHandler;
