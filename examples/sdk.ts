import { MeridianDBClient } from "meridiandb-sdk";

class ChatbotWithMemory {
  private client: MeridianDBClient;

  constructor(accessToken: string) {
    this.client = new MeridianDBClient({
      url: "https://api.meridiandb.com",
      accessToken: accessToken
    });
  }

  async processUserMessage(userId: string, message: string): Promise<string> {
    try {
      // 1. Search relevant past interactions
      const pastMemories = await this.client.retrieveMemoriesSingleAgent({
        query: message
      });

      // 2. Use past memories to provide better context
      let context = "Previous interactions:\n";
      pastMemories.data?.forEach((memory : any, index : number) => {
        context += `${index + 1}. ${memory.content}\n`;
      });

      // 3. Generate response (your AI logic here)
      const response = await this.generateAIResponse(message, context);

      // 4. Store this interaction as a new memory
      await this.client.storeMemory({
        agentId: "chatbot-v1",
        organizationId: "acme-corp",
        content: `User: ${message}\nAssistant: ${response}`,
        recencyScore: 0.9,
        accessFrequency: 0.7,
        isFactual: true,
        isIrrelevant: false,
        context: `conversation with user ${userId}`,
        successRate: 1.0,
        positive: 1,
        negative: 0,
        accessLevel: "private",
        stage: "episodic"
      });

      return response;

    } catch (error) {
      console.error("Error processing message:", error);
      return "I apologize, but I'm having trouble accessing my memory right now.";
    }
  }

  async recordConversationOutcome(memoryId: string, wasHelpful: boolean) {
    await this.client.recordFeedback({
      success: wasHelpful,
      memories: [memoryId]
    });
  }

  private async generateAIResponse(message: string, context: string): Promise<string> {
    // Your AI model integration here
    // This could be OpenAI, Anthropic, or any other AI service
    return `Based on our previous conversations, I understand you're asking about: ${message}`;
  }
}

// Usage
const chatbot = new ChatbotWithMemory("your-access-token");


// Process a user message
chatbot.processUserMessage("user-123", "What's the weather like today?")
  .then(response => {
    console.log("Bot:", response);
  });