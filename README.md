# Timi Convex Migration

This repository contains the migration from Prisma/PostgreSQL to Convex for the Timi monorepo.

## Migration Overview

The migration includes the following components:
1. Schema conversion from Prisma to Convex
2. Function implementation for all data operations
3. Client integration examples
4. Data migration scripts

## Schema Conversion

We've converted all Prisma models to Convex document schemas with proper indexing for performance.

## Function Implementation

We've implemented comprehensive Convex functions for:
- User management with Clerk auth integration
- Extension data synchronization
- Activity tracking and session management
- Announcements system
- System metrics

## Data Migration

The migration script handles transferring existing PostgreSQL data to Convex while maintaining data integrity.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize Convex:
```bash
npx convex init
```

3. Configure environment variables:
```bash
# Add your Convex deployment URL
CONVEX_URL=your-convex-url-here

# Add your Clerk credentials
CLERK_SECRET_KEY=your-clerk-secret-key-here
```

## Deployment

1. Deploy to Convex:
```bash
npm run deploy
```

## Running the Migration

1. Update the migration script with your PostgreSQL connection details
2. Run the migration:
```bash
npm run migration
```

## Client Integration

Use the client integration example in `client/integration.ts` to integrate Convex with your frontend applications.

## Benefits of Migration

- Real-time capabilities with built-in subscriptions
- Serverless architecture with automatic scaling
- Simplified development with end-to-end TypeScript support
- Improved performance through automatic caching
