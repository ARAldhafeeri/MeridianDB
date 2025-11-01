# Deployment Guide

## Prerequisites
```bash
# Create Vectorize index
npx wrangler vectorize create meridiandb --dimensions=768 --metric=cosine

# Create metadata index for agent separation
npx wrangler vectorize create-metadata-index meridiandb --property-name=agentId --type=string
```

## Development
```bash
npm install
npm run build -w shared
npm run server:migrations
npm run server:migrate:local
npm run dev
```

## Initialization
1. Set environment variables:
```json
{
  "ADMIN_EMAIL": "admin@admin.com",
  "ADMIN_PASSWORD": "admin", 
  "SUPER_ADMIN_INIT_TOKEN": "your-secret-token"
}
```

2. Initialize super admin:
```bash
curl -X POST /auth/init \
  -H "Authorization: Bearer your-secret-token"
```

## Production Deployment
```bash
# Deploy migrations
npx wrangler d1 execute meridiand1 --file=./drizzle/migrations/<migration>.sql

# Deploy workers
npx wrangler deploy
```

## Queue Configuration
**Temporal Queue** (wrangler.jsonc):
```json
{
  "triggers": {
    "crons": ["*/30 * * * *"]  // Every 30 minutes
  }
}
```

**Options**:
- `* * * * *` - Every 30s (high frequency)
- `*/5 * * * *` - Every 5 minutes  
- `*/30 * * * *` - Every 30 minutes (default)
- `0 * * * *` - Every hour