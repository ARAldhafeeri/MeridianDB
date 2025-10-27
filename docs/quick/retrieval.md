

# Multi-Dimensional Retrieval

## Semantic (Base Layer)
- Vector similarity search
- Over-fetches initially for refinement
- Uses Vectorize with cosine similarity

## Temporal Filtering
We use exponential decay with exponential boost algorithm and multiple parameters to tune the experience of temporal features based on `access count`, `lastAccessed Date` and `per agent configurations`.
 
```javascript
// Exponential decay with frequency boost
function calculateRecencyScore(accessCount, lastAccessed, config) {
  const hoursSinceAccess = (now - lastAccessed) / (1000 * 60 * 60);
  const timeDecay = Math.exp(-hoursSinceAccess / config.halfLifeHours);
  const frequencyBoost = Math.log10(accessCount + 1);
  return combinedScore; // 0-100 scale
}
```

### Presets
- **Balanced**: 7-day half-life , suitable for balanced approach to decay.
- **Aggressive**: 3-day half-life  suitable for aggresive decay think ( chatbots, short-context window)
- **Long-term**: 30-day half-life long term decay, slow update of temporal feature ( think like codebases, AI assisted coding ).

## Contextual Filtering
- Developer-supplied context (task, environment)
- Included in response if semantic match
- No auto-generation (future feature)

## Behavioral Filtering
```javascript
// Wilson score confidence interval
function wilsonScore(success, failure, confidence = 0.95) {
  // Calculates confidence-based success rate
  return score; // 0-1 scale
}
```

**Zero-sum mechanism**: All memories in response share success/failure
```


## 7. `configuration.md`
```markdown
# Configuration Guide

## Agent Creation
```javascript
const agentConfig = {
  // Temporal features
  halfLifeHours: 168,      // 7 days
  timeWeight: 0.6,
  frequencyWeight: 0.4,
  decayCurve: 'hybrid',
  decayFloor: 0.15,
  
  // Behavioral features  
  successRate: 0.0,        // Start at 0 for passive learning
  stabilityThreshold: 0.0   // Start at 0 for passive learning
};
```

## Preset Configurations

### Balanced (Default)
```javascript
{
  halfLifeHours: 168,      // 7 days
  timeWeight: 0.6,
  frequencyWeight: 0.4,
  decayCurve: 'hybrid',
  decayFloor: 0.15
}
```

### Aggressive Decay
```javascript
{
  halfLifeHours: 72,       // 3 days  
  timeWeight: 0.7,
  frequencyWeight: 0.3,
  decayCurve: 'exponential'
}
```

### Long-Term Memory
```javascript
{
  halfLifeHours: 720,      // 30 days
  timeWeight: 0.5, 
  frequencyWeight: 0.5,
  decayCurve: 'polynomial'
}
```

## Important Notes
- **Choose carefully**: Parameters affect memory filtering significantly
- **Avoid changes**: Don't modify after agent creation
- **Eventual consistency**: Config changes apply gradually
- **Monitor**: Use Admin UI to observe filtering effects

## Behavioral Thresholds
- Start with `successRate: 0.0` to avoid false positives
- Gradually increase as agent matures (e.g., 0.5, 0.7)
- Use Wilson score for confidence-based filtering
```

## 8. `limitations.md`
```markdown
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
- **Over-fetching**: Semantic search retrieves extra for filtering
- **Edge compute**: Low latency but worker constraints
```

These documentation files cover all critical aspects of MeridianDB while remaining concise and focused. Each file addresses a specific concern area that developers and operators need to understand.