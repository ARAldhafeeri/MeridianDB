# MeridianDB Overview

AI-first, Auto-RAG, a serverless database that enhances RAG with multi-dimensional retrieval. In addition to semantic search, we added temporal and behavioral awareness as well. NewSQL-inspired eventual consistencykeeps both the vector database and content and features data synced across Cloudflare D1 and Vectorize. 

## Core Problem
Traditional RAG suffers from:
- Catastrophic forgetting
- Lack of temporal awareness
- No behavioral learning

## Solution
Multi-dimensional retrieval:
- **Semantic**: Vector similarity search
- **Temporal**: Time-based memory decay
- **Contextual**: Task/environment filtering
- **Behavioral**: Success-based optimization

## Architecture
<img src="assets/arch.png" width="600" height="400" />

- (1), (2) **Human clients**: SDKs is for **Agentic AI developers**  Admin Portal for **DB operators**.

- (3) **Worker API gateway**: Handles requests from both **clients** and **SDK integrations**.

- (4) **Eventual consistency model**: **Write operations** are queued, simplifying retries and error handling. Follows **Cloudflare’s consistency model** for **Vectorize**.

- (5), (6), (7), (8) **Queues**: Publish **write events** consumed by workers for **vectorization** and **D1**. Main goal is to keep retreival latency low and update features.

- (9) **Retrieval engine**: Performs **multi-dimensional queries** for the **AI agent**

- (10), (11), (12), (13), (14) **Behavioral logging**: Tracks **Memory performance** on tasks based on user feedback. Creates a **feedback loop** for continuous improvement. Configurable passive/active learning for each agent. 


## Mostly Tabular Data for Features no Graphs
In MeridianDB we aimed to maximize scalability and performance, there fore we designed to store extra features ( temporal and behavioral ) into SQL columns. 

We gurantee eventual consitency, we provide multiple settings that control the consistency experience to fit your business needs. 

The process is as follow :
1. Agent send a retreival query.
2. MeridianDB backend perform a similarity search on the query, with intentional over-fetching the results ( configurable ) with ( TOP-K) parameter.
3. Content is fetched from D1.
4. Data is filtered-out based on agent configuration.

## Quick start
We wrote quick start section to understand our design choices and answers the why's, how's around MeridianDB.
- <a href="quick/architecture" >Architecture Dive</a>
- <a href="quick/retrieval" >Multi-Dimensional Retrieval</a>
- <a href="quick/consistency" >Consitency Model</a>
- <a href="quick/devanddep" >Dev environment & Deployment</a>