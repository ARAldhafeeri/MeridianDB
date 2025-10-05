# MeridianDB

**MeridianDB** is an AI-first, serverless database that redefines retrieval for agents.
It goes beyond traditional RAG pipelines with **temporal, contextual, and behavioral dimensions** — helping agents avoid catastrophic forgetting and strike the right balance between stability and plasticity.

Built on **Cloudflare Workers**, **D1**, **Vectorize**, **KV**, **Queues**, **React**, **Hono**, and **R2** — MeridianDB is scalable, event-driven, and developer-friendly, optimized for the edge, cheap to run, all battries included out of the box.

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

MeridianDB leverages queues to minimize **write-on-read** overhead when updating both temporal and behavioral feature events.
We provide a lightweight distributed queue implementation using Cloudflare Workers:
👉 [cfw-poor-man-queue](https://github.com/ARAldhafeeri/cfw-poor-man-queue)

For maximum scalability, we recommend deploying the queues as **standalone workers**. Each can handle 1000 message per miniute easily. Such limit is by "free cloudflare workers plan", we built the queue for that purpose. Beyhond that you can use Cloudflare queues, our enterprise version uses [cloudflare-queues](https://developers.cloudflare.com/queues/). MeridianDB uses two primary queues:

1. **Temporal Features Queue**
   When the AI retrieves information from MeridianDB, attributes like frequency and recency are updated via messages published to this queue. These updates are then applied to temporal decay filtering.

2. **Behavioral Features Queue**
   This queue powers behavioral analysis. When you send responses to your users, you can log their feedback through the behavioral logging endpoint. Users may mark a response as a success or failure, which directly influences success rate filtering.

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

Such calculation are happening in SQL. So the AI retreival latency still kept in 1-100ms per retreival.

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

This runs the temporal tick every 30 minutes, controlling:

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
