import { Message } from "@meridiandb/shared/src/queue/entities/domain/queue";
import { IConsumeHandler } from "@meridiandb/shared/src/queue/entities/interfaces/IRequestHandler";

class ConsumerHandler implements IConsumeHandler {
  async handle(messages: Message[]): Promise<void> {
    Promise.race([messages]);
  }
}
export default ConsumerHandler;
