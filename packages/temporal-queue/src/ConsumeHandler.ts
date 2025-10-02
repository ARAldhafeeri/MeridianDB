import { IConsumeHandler } from "@meridiandb/shared/src/queue/entities/interfaces/IRequestHandler";
import { TemporalMessage } from "types";

class ConsumerHandler implements IConsumeHandler {
  async handle(messages: TemporalMessage[]): Promise<void> {
    Promise.race([messages]);
  }
}
export default ConsumerHandler;
