# SDK Usage

## Installation
```bash
npm install meridiandb-sdk
```

## Basic Usage
```javascript
import { MeridianDBClient } from "meridiandb-sdk";

const client = new MeridianDBClient({
  url: "https://api.meridiandb.com",
  accessToken: "your-token"
});

// Store memory
await client.storeMemory({
  agentId: "chatbot-v1",
  content: "User query and response",
  context: "conversation context",
  // ... other features
});

// Retrieve memories  
const memories = await client.retrieveMemoriesSingleAgent({
  query: "user question"
});

// Record feedback
await client.recordFeedback({
  memories: ["memory-id-1", "memory-id-2"],
  success: true
});
```

## Integration Pattern
```javascript
class AIAgent {
  async processMessage(userId, message) {
    // 1. Retrieve relevant memories
    const pastMemories = await this.client.retrieveMemoriesSingleAgent({
      query: message
    });
    
    // 2. Generate response with context
    const response = await this.generateResponse(message, pastMemories);
    
    // 3. Store interaction
    await this.storeInteraction(message, response);
    
    return response;
  }
  
  async recordOutcome(memoryId, wasSuccessful) {
    await this.client.recordFeedback({
      memories: [memoryId],
      success: wasSuccessful
    });
  }
}
```

## Learning Phases
### Passive Phase (Initial)
- Disable temporal/behavioral filtering
- Gather interaction data
- Set `stabilityThreshold = 0.0`, `successRate = 0.0` for your agent.

### Active Phase (Mature)
- Enable filtering with tuned thresholds
- Filter low-success memories
- Apply temporal decay
- By carefully setting propre `stabilityThreshold`, `successRate = 0.0`