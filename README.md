# MeridianDB

A state-of-the-art serverless, AI-first federated vector-graph database that enables agent collaboration through fine-grained memory-sharing access and takes agent collaboration and personalization to another level by enabling continuous learning, powered by Cloudflare workers and integrated with solutions like D1, KV storage, Vectorize, and R2. Hono, React, and software engineering wizardry.


## 🚀 Core Features

### 1. Knowledge Graph + Vector Fusion

* Hybrid graph + embedding storage
* Temporal decay & dynamic relevance scoring
* Multi-dimensional similarity (semantic, temporal, contextual, behavioral)

### 2. Advanced Retrieval Engine

* GraphRAG with path-weighted scoring
* Drift detection & adaptive ranking
* Cross-agent knowledge transfer

### 3. Multi-Agent Continuous Learning

* Real-time embedding updates
* Federated learning across clusters
* Memory consolidation & pruning
* Personalization vector evolution

### 4. Scalable Multi-Tenancy

* Org-level isolation with selective sharing
* Agent identity & quota management
* Cross-tenant graph federation

### 5. Security & Authorization

* JWT with refresh token rotation
* Granular CRUD + sharing rights
* Contextual access gates
* Full audit trails

---

## 🛠 Tech Stack

* **Cloudflare D1** → relational metadata, user/permissions
* **Vectorize** → embeddings storage & retrieval
* **KV** → session state, counters, real-time cache
* **R2** → object storage for models, artifacts, backups
* **Workers** → low-latency, edge-native compute

**Optimizations**

* Embedding quantization
* Lazy graph loading
* Predictive caching
* Smart connection pooling
* Batch vector ops

---

## 🏗 Architecture

### Data Layer

```
Knowledge Graphs (D1)      Vector Embeddings (Vectorize)  
Session Cache (KV)         Object Storage (R2)  
```

### Processing Layer

```
Query Engine  ← GraphRAG, ranking, adaptation  
Learning Engine ← embedding updates, consolidation  
```

### API Layer

```
Agent Management ← auth, authz, multi-tenancy  
Knowledge Ops   ← retrieval, insertion, sharing  
```

---

## 🔑 Key Innovations

1. **Contextual Similarity Fusion**

   * Temporal weighting, interaction boosting, adaptive embedding spaces

2. **Memory Consolidation Algorithm**

   * Hierarchical clustering, retention policies, contextual forgetting

3. **Predictive Graphs**

   * Relationship prediction, temporal evolution, cross-domain bridges

4. **Adaptive Authorization**

   * Context-aware permissions, reputation systems, federated queries

---

## Installing libraries 

```
npm install --legacy-peer-deps

```