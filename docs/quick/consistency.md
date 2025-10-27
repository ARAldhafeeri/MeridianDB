# Consistency Model

## Eventual Consistency Design
**Constraint**: Vectorize is eventually consistent
**Solution**: Queue-based writes ensure consistency

## Write Pattern
```
Store → Queue → [Process] → Vectorize + D1
                    ↓
           [Retrieve] ← Consistent State
```

## Redundant Storage
- **Vectorize**: Embeddings + agentId metadata
- **D1**: Full multidimensional features with memory content
- **KV**: Counters, session state
- We currently only support text.

## Queue Implementation
### Temporal Features Queue
- Updates recency/frequency on access
- Uses PMQ (Poor Man's Queue) for free tier
- Configurable processing frequency

# Behavioral Endpoint  
- Processes user feedback (success/failure)
- Updates success rate metrics on all involved memory based on user feedback.
- Independent of retrieval process simple webhook ( think like dislike generation on ChatGPT)

## Trade-offs
- ✅ Scalable, cost-effective
- ✅ Automatic retries/failover  
- ❌ Reads may lag writes
- ❌ Requires cleanup jobs