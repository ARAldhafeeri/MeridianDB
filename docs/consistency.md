# Consistency Model

## Eventual Consistency Design

**Constraint:** Vectorize operates under an eventually consistent model.
**Solution:** Queue-based writes on retreival ( for temporal data as it depends on access frequency ) maintain consistency and minimize search latency by updating temporal features on access. We provide **PMQ**, a free and open-source queue implementation for Cloudflare Workers.

Note: We do not have access to Cloudflare’s low-level APIs, nor are we affiliated with them. However, this solution works well within the limits of Cloudflare’s free plan.

The design ensures that you can experiment with **MeridianDB** without barriers no need to pay for Cloudflare Workers to get started.

Our **Enterprise Edition** uses Cloudflare Queues by default for maximum scalibilty.

## Write Pattern

```
Store → Queue → [Process] → Vectorize + D1
                    ↓
           [Retrieve] ← Consistent State
```

## Redundant Storage
- **Vectorize**: Embeddings + agentId metadata
- **D1**: Full multidimensional features with memory content
- **KV**: Counters, session state.
- We currently only support text.

## Queue Implementation
### Temporal Features Queue
- Updates recency/frequency on access on memories we implemented our queue using cloudflare workers, with Write-ahead log and buffer-flush.
- Uses PMQ (Poor Man's Queue) for free tier.
- Configurable processing frequency.

# Behavioral Endpoint  
- Processes user feedback (success/failure).
- Updates success rate metrics on all involved memory based on user feedback.
- Independent of retrieval process simple webhook ( think like dislike generation on ChatGPT).

## Trade-offs
- ✅ Scalable, cost-effective
- ✅ Automatic retries/failover  
- ❌ Reads may lag writes
- ❌ May Requires cleanup jobs ( the algorithm only filter out decayed, bad behavioral score data ).