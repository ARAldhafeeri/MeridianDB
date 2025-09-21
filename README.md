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
Will run watch on all packages.

```bash
npm run dev
```


## 📦 Testing
Will run watch on all packages.

```bash
npm run test
```

### Migrations
7. migrations

# Generate migrations from your schema

npx drizzle-kit generate

# Apply migrations to your D1 database (local)

npx wrangler d1 execute meridiand1 --local --file=./drizzle/migrations/0000_purple_lilith.sql

# Apply migrations in production

npx wrangler d1 execute meridiand1 --file=./drizzle/migrations/0000_purple_lilith.sql
