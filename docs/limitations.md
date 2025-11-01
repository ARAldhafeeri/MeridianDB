# Limitations & Considerations

## Consistency
- **Eventual consistency**: Reads may lag behind writes
- **Vectorize constraint**: Built on eventually consistent infrastructure
- **Queue dependencies**: Processing delays affect freshness

## Storage Limits
- **D1**: 10GB database limit
- **Vectorize**: Dimension and metric constraints
- **KV**: 1GB per namespace

## Development Constraints
- **Cloudflare lock-in**: Tight ecosystem coupling
- **Context generation**: Manual developer input required
- **Learning curve**: New retrieval model concepts

## Operational Considerations
- **Temporal decay**: Requires periodic cleanup jobs
- **Queue management**: PMQ vs Cloudflare Queues trade-offs
- **Memory growth**: Unbounded memory accumulation

## Performance Trade-offs
- **SQL scoring**: Scalable but limited complexity
- **Over-fetching**: Semantic search retrieves extra for filtering controlable through topK environment variable. 
- **Edge compute**: Low latency but worker constraints