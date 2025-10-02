import {
  Environment,
  TemporalMessage,
} from "@meridiandb/shared/src/queue/entities/domain/queue";
import { IConsumeHandler } from "@meridiandb/shared/src/queue/entities/interfaces/IRequestHandler";

class ConsumerHandler implements IConsumeHandler {
  /**
   * Update multiple messages temporal features with effecient d1 query.
   * @param messages queue messages with temporal feature data
   */
  constructor(private env: Environment) {}

  async handle(messages: TemporalMessage[]): Promise<void> {
    Promise.race([messages]);
  }
}
export default ConsumerHandler;
