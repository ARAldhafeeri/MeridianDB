# MeridianDB

**MeridianDB** is an AI-first, serverless database that redefines retrieval for agents.
It goes beyond traditional RAG pipelines with **temporal, contextual, and behavioral dimensions** — helping agents avoid catastrophic forgetting and strike the right balance between stability and plasticity.

Built on **Cloudflare Workers**, **D1**, **Vectorize**, **KV**, **Queues**, **React**, **Hono**, and **R2** — MeridianDB is scalable, event-driven, and developer-friendly, optimized for the edge, cheap to run, all battries included out of the box.

<a href="https://araldhafeeri.github.io/MeridianDB/">Docs</a><br>
<a href="./whitepaper.pdf">White paper</a>
---

## 🚀 Core Features

### 1. Multi-Dimensional Retrieval

* **Semantic:** Normal Semantic search but with slightly over-fetching to allow for the other dimensions to refined retrieval beyond basic vector search.
* **Temporal:** Data decays over time, supports factual/irrelevant tagging, and frequency weighting, vector results are filtered upon temporal features.
* **Contextual:** Filters results based on task, environment, and developer-supplied context which is included in the response if semantic search hit the record.
* **Behavioral:** Tracks retrieval’s effect on task success for continuous improvement, every time we log behavior success rate of retrieving such record is modified.

### 2. Integrated Consistency Model
Cloudflare victorize is huge design constraint since the whole database architecture is built on top of it. Victorize architectural depend on eventual consistency therefore the design of the federated db should follow: 

* Queue-based writes ensure **eventual consistency** without manual orchestration.
* Data is redundantly stored (Vector + D1) to preserve multidimensional context.

### 3. Developer Experience

* Simple API: `store`, `retrieve`, `log`.
* Beyond Enhanced RAG users can use super-admin token to interact with the whole APIs of MeridianDB.
* Built-in Operator UI for observability, data management, and debugging.

### 4. Cloudflare-Native Scalability

* Global low-latency access.
* Automatic retries, failover, and event-driven processing.
* Cost-efficient, horizontally scalable architecture.

---

## 🏗️ Architecture

```
Human Clients + SDKs
        │
 Worker API Gateway
        │
   Write Queues ──► Workers ──► Vectorize + D1
        │
 Retrieval Engine ──► Multi-Dimensional Query
        │
 Behavioral Logging + Feedback Loop
```

* **No Graph Traversal:** Features are stored in **D1 columns** for performance and simplicity.
* **SQL-Based Scoring:** Composite feature scoring (semantic, temporal, contextual, behavioral) performed in SQL for maximum scalability. And aim to improve the retreival accuracy. 

---

## ⚡ Benefits

* **Consistency & Reliability** – Eliminates ghost embeddings and race conditions.
* **Operational Simplicity** – One system, one SDK, no manual glue code.
* **Continuous Improvement** – Built-in behavioral logging and feedback loops.
* **Edge-Native Performance** – Runs on Cloudflare’s global network for millisecond latency.

---

## ⚠️ Limitations

* Eventual consistency — reads may slightly lag behind writes.
* Developers must supply contextual features (future iterations may auto-generate context).
* Temporal decay requires periodic cleanup jobs.
* Learning curve for new retrieval model (SDK minimizes complexity).
* Optimized for Cloudflare ecosystem (tight coupling).
* d1 have limit of 10 GB.

---

## 🛠 Tech Stack

* **Cloudflare D1** – Relational metadata & feature storage
* **Vectorize** – Embedding storage & similarity search
* **KV** – Session state, counters, cache
* **R2** – Object storage for models, artifacts, backups
* **Workers** – Edge-native compute for low-latency operations
* **Full-stack Development**: With Hono, React, Vite.

---

## 📦 Pre-installation

MeridianDB leverages queues to minimize **write-on-read** overhead when updating temporal features for each memory.
We provide a lightweight distributed queue implementation using Cloudflare Workers:
👉 [cfw-poor-man-queue](https://github.com/ARAldhafeeri/cfw-poor-man-queue)

The PMQ allow you to run MeridianDB on Cloudflare free membership, even though PMQ is well built and scalable, we do recommend using cloudflare queues. Cloudflare built their own queues with APIs we don't have access to, so they would be much more scalable. 

For maximum scalability, we recommend deploying the queues as **standalone workers**. Each can handle 1000 message per miniute easily. Such limit is by "free cloudflare workers plan", we built the queue for that purpose. Beyhond that you can use Cloudflare queues, our enterprise version uses [cloudflare-queues](https://developers.cloudflare.com/queues/). MeridianDB uses two primary queues:

1. **Temporal Features Queue**
   When the AI retrieves information from MeridianDB, attributes like frequency and recency are updated via messages published to this queue. These updates are then applied to temporal decay filtering.

2. **Behavioral Features**
   This powers behavioral analysis. When you send responses to your users, you can log their feedback through the behavioral logging endpoint. Users may mark a response as a success or failure, which directly influences success rate filtering.

Note PMQ is used only in temporal queue because it's related to data fetching and searching. 

Nevertheless, the behavioral features is updated based on your users feedback it's not related to the retreival of data like the temporal features so we don't use PMQ in fact updating temporal features is just single rest endpoint.

Both **temporal** and **behavioral threshold filtering** are fully customizable from the **Admin Portal**.

Development environment run both queues as standalone worker, in deployment as well we recommend this approach.


## Configuring Temporal features  

We use Exponential Decay with Frequency Boost in temporal features per memory access for your AI agent. Each AI agent has its own configuration that determines how memory access affects retrieval. You can configure these parameters when you create an AI agent.

Please see example <a href="./examples//temporal.ts">Temporal Features Confiugration</a>

### Configuration Presets

#### Balanced (Default)
Recommended for general-purpose use cases.

```typescript
const balancedConfig = {
  halfLifeHours: 168,      // 7 days
  timeWeight: 0.6,
  frequencyWeight: 0.4,
  decayCurve: 'hybrid',
  decayFloor: 0.15
};
```

#### Aggressive Decay
For use cases such as user context in chatting where faster forgetting is desirable.

```typescript
const aggressiveConfig = {
  halfLifeHours: 72,       // 3 days
  timeWeight: 0.7,
  frequencyWeight: 0.3,
  decayCurve: 'exponential'
};
```

#### Long-Term Memory
For use cases requiring extended memory retention.

```typescript
const longTermConfig = {
  halfLifeHours: 720,      // 30 days
  timeWeight: 0.5,
  frequencyWeight: 0.5,
  decayCurve: 'polynomial'
};
```

### Important Considerations

These parameters balance **stability and plasticity** for your agent's use case. The  `stabilityThreshold` which is configurable from within the admin portal, will determine based on the calculation weather to include or not include the memory. 

Such calculation are happening in SQL. So the AI retreival latency still kept in 300-500ms per retreival.

**Warning:** We advise against changing parameters after agent creation. Choose carefully, as they directly affect memory filtering during AI agent retrieval.

We gurantee eventual consistency on when your agent new configuration will be applied on memories temporal featuers calculation. 

Each message batch add the agentId, before processing the temporal features the agent configuration is fetched. 


The tick at which you process temporal features matters as well, depending on the agent memory, configure the tick creafully, you can configure the temporal feature queue tick from `/packages/temporal-queue/wrangler.jsonc`.

```JSON
	"triggers": {
		"crons": [
			"* * * * *"
		]
	},
```

This runs the temporal tick every 30 second, controlling:

The rate at which data is flushed for temporal feature calculation
The stability of memory retrieval for your AI agent

Adjust the cron expression based on your needs:

`* * * * *` - Every 30 seconds (high frequency, higher resource usage)
`*/5 * * * *` - Every 5 minutes
`*/30 * * * *` - Every 30 minutes (balanced)
`0 * * * *` - Every hour (low frequency, lower resource usage)

Note this is the tick for consuming a single message batch.

### Calculation Implementation

```typescript
/**
 * Calculates a recency score with configurable parameters
 * 
 * @param {number} accessCount - Total number of accesses
 * @param {number} lastAccessed - Timestamp of last access (ms)
 * @param {Object} options - Configuration options
 * @returns {number} Score between 0-100
 */
function calculateRecencyScore(accessCount, lastAccessed, options = {}) {
  // Default configuration (can be overridden)
  const config = {
    baseScore: 100,
    halfLifeHours: 168,
    timeWeight: 0.6,
    frequencyWeight: 0.4,
    frequencyDamping: 4,
    decayFloor: 0.1,
    decayCurve: 'exponential',  // 'exponential', 'polynomial', or 'hybrid'
    ...options
  };

  const now = Date.now();
  const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);

  // Calculate time decay based on selected curve
  let timeDecay;
  switch (config.decayCurve) {
    case 'polynomial':
      // Gentler initial decay, steeper later
      timeDecay = 1 / (1 + Math.pow(hoursSinceAccess / config.halfLifeHours, 2));
      break;
    
    case 'hybrid':
      // Exponential with a floor to prevent complete decay
      timeDecay = Math.max(
        config.decayFloor,
        Math.exp(-hoursSinceAccess / config.halfLifeHours)
      );
      break;
    
    case 'exponential':
    default:
      timeDecay = Math.exp(-hoursSinceAccess / config.halfLifeHours);
  }

  // Logarithmic frequency boost (prevents domination by frequent accesses)
  const frequencyBoost = Math.log10(accessCount + 1);

  // Combine components with configurable weights
  const rawScore = config.baseScore * (
    config.timeWeight * timeDecay + 
    config.frequencyWeight * (frequencyBoost / config.frequencyDamping)
  );

  // Normalize to 0-100 scale
  return Math.min(100, Math.max(0, rawScore));
}
```
---


## Configuring Behavioral features  


Behavioral features can be configured through **agent configurations**, specifically using the `success_rate` parameter.
In **MeridianDB**, the success rate serves two main purposes:

1. It’s used to calculate the **Wilson score**, which determines the confidence interval for propagation.
2. It acts as a filtering metric in behavioral evaluations for your agent.

We provide a single endpoint to record **behavioral analysis events**.
This endpoint expects the following payload:

```json
{
  "memories": ["id1", "id2"],
  "success": true
}
```

* **`memoryIds`** represent the memory entries used within your RAG (Retrieval-Augmented Generation) process.
* **`success`** indicates whether the memory retrieval or decision outcome was successful.

A **zero-sum** mechanism is applied — meaning all referenced memories are either rewarded or penalized together based on the AI’s outcome.

The configured `success_rate` in your agent settings is then used to:

* Filter results based on behavioral metrics, and
* Feed into the **Wilson score** calculation, implemented as follows:

```typescript
function wilsonScore(success: number, failure: number, confidence = 0.95) {
  const total = success + failure;
  if (total === 0) return 0;

  const p = success / total;
  const z = confidence; // 95% confidence Z-score

  const denominator = 1 + (z * z) / total;
  const center = p + (z * z) / (2 * total);
  const spread = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * total)) / total);

  return Math.max(0, (center - spread) / denominator);
}
```

Unlike **temporal features**, which depend on **access frequency**, **behavioral features** rely on **decisions originating from your application logic**.

For example, in a **customer service chatbot**, you could add two feedback buttons — *Like* and *Dislike*.
If the user clicks *Dislike*, your application would send the following payload to the `/memories/agent/behavioral` endpoint:

```json
{
  "memories": ["uuid-1", "uuid-2"],
  "success": false
}
```

This updates the internal counters for success and failure for those memory entries, influencing how they’re used in future **augmented generations**.


## Temporal and Behavioral Filtering Strategy


MeridianDB follows a **filter-out strategy** for both **Temporal** and **Behavioral** features in AI retrieval.

We recommend configuring your agent to operate in **two phases**:

#### 1. Passive Learning Phase

During this initial phase, your AI agent **should not use** temporal or behavioral features.
This allows the system to gather sufficient interaction data before applying active learning filtering for both temporal and behavioral features.

#### 2. Active Learning Phase

Once your agent has accumulated meaningful experience, you can **activate** both features by setting appropriate values for:

* `successRate` — for behavioral learning
* `stabilityThreshold` — for temporal stability

MeridianDB will automatically filter out:

* Memories with a **low success rate**, based on your configuration
* Memories with a **low stability score**, below your defined threshold

Activating these parameters too early may lead to **false positives**, as the system hasn’t yet stabilized.

---

### Behavioral Features: Success Rate Configuration

Since both Temporal and Behavioral features rely on **active learning**, we recommend starting with a **zero based `successRate`** for behavioral features.
This helps prevent false negatives when calculating the **Wilson score** in early agent usage.

For example, if a memory has 2 failures and 1 success (3 total attempts), and you set the success rate to `0.0`:

```typescript
console.log(wilsonScore(1, 2, 0.0)) // 0.33
```

This value ensures the memory **is not filtered out**, helping avoid false positives early on.

As your system matures, you can **adjust the success rate** to reflect your desired performance threshold.

For instance, once the same memory reaches 100 successes and 30 failures, with `successRate` configured at `0.5`:

```typescript
console.log(wilsonScore(100, 30, 0.5)) // 0.75
```

Now, the memory remains active, as it meets your defined success criteria.

---

### Temporal Features: Stability Threshold Configuration

For temporal learning, start with a **small `stabilityThreshold`** (e.g., `0.0`) during the passive phase.
This effectively disables temporal filtering until the agent data becomes well-trained.

Once your agent has reached consistent usage, activate temporal learning by setting the **appropriate `stabilityThreshold`** for your environment.
Any memory with a recency score below this threshold will then be filtered out automatically.


## Software Development kit (SDK)

MeridianDB provide SDK for agent development. `meridiandb-sdk`

```Bash
npm i meridiandb-sdk
```
run tests 

```Bash
npm run test:sdk
```
example usage :

Note : The access token is per agent, use headless via our shared collections here:
1. https://www.postman.com/planetary-station-563547/workspace/meridiandb/collection/19411915-e41b8dae-8830-4f6d-b260-4d26f3d52651?action=share&creator=19411915
2. https://www.postman.com/planetary-station-563547/workspace/meridiandb/collection/19411915-d835a1de-49c7-48fe-b3c8-6f2d75262c09?action=share&creator=19411915

You need to self-host all : 
1. core backend packages/server.
2. temporal queue , dead-letter queue packages/temporal-queue , packages/dead-letter-queue. All of which can be deployed as cloudflare workers.
3. Client : you can deploy client as react, vite preset on cloudflare pages. 

We don't recommend PMQ for serious production workflow, it has limitaitons, please contact us for the enterprise version which uses cloudflare queues.

```Typescript
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
```
## 📦 Installation

```bash
npm i
```

## 📦 Build

```bash
npm run build -w shared
```



## 📦 watch ts compiler
Will run watch on all packages.

```bash
npm run watch 
```

## 📦 Run dev environment
Will run watch on all packages. But before hand make sure to create d1, vectorize, kv instances. 
- https://developers.cloudflare.com/d1/
- https://developers.cloudflare.com/vectorize/
- https://developers.cloudflare.com/kv/

if you want to use the current config for dev enviornment create vectorize index 

```Bash
npx wrangler vectorize create meridiandb --dimensions=768 --metric=cosine
```

meridiandb uses agentId meta data for seperating agents memory storage at single agent search endpoint, you must create the metadata index 
```Bash
npx wrangler vectorize create-metadata-index meridiandb --property-name=agentId --type=string

```
Run migrations 

```
npm run server:migrations
```

```
npm run server:migrate:local
```

```bash
npm run dev
```
Once you run the local environment you need to  initialize the super admin by hiting the following endpoint `/auth/init` don't forget to update environmenet variables for both locally and in deployment for the supoer admin 

```
// rest of packages/server/wrangler.jsonc
   "vars": {
    "ADMIN_EMAIL": "admin@admin.com",
    "ADMIN_PASSWORD": "admin",
    "SUPER_ADMIN_INIT_TOKEN": "your-secret-s-admin-init-token", 
    // rest of env vars.
  },
```

## 📦 Testing
Will run integration tests.

```bash
npm run test
```


# Deployment 
```
npx wrangler d1 execute meridiand1 --file=./drizzle/migrations/<your_migration_name>.sql
```

```
wrangler deploy
```

# Docs 

MeridianDB uses <a href="https://www.mkdocs.org/getting-started/">MkDocs</a> to manage its documentation.


You can add, edit, or remove documentation pages within the docs folder.

Each page should be comprehensive, concise, and straight to the point.

- Run the documentation locally, navigate to root folder:

- Install requirements:

```
pip install -r requirements.txt
```

- Run the docs:

```Bash
mkdocs serve
```

docs should be running at http://localhost:8000



