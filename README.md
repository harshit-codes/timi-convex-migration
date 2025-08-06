# Timi Monorepo - Convex Migration

This repository contains the migration from Prisma/PostgreSQL to Convex for the Timi monorepo, now restructured as a proper monorepo.

## Monorepo Structure

```
├── apps/
│   ├── web/              # Main web application
│   ├── extension/        # Browser extension
│   └── api/              # API server (if applicable)
├── packages/
│   ├── convex-functions/ # Convex backend functions
│   ├── convex-client/   # Client integration layer
│   ├── convex-schema/    # Shared schema definitions
│   ├── shared/           # Shared utilities and types
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared TypeScript types
│   └── migration/        # Data migration scripts
├── turbo.json            # Turbo build configuration
└── package.json          # Root package file with workspaces
```

## Migration Overview

The migration includes the following components:
1. Schema conversion from Prisma to Convex
2. Function implementation for all data operations
3. Client integration examples
4. Data migration scripts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize Convex:
```bash
cd packages/convex-functions && npx convex init
```

3. Configure environment variables:
```bash
# Add your Convex deployment URL
CONVEX_URL=your-convex-url-here

# Add your Clerk credentials
CLERK_SECRET_KEY=your-clerk-secret-key-here
```

## Development

Run all apps and packages in development mode:
```bash
npm run dev
```

Run specific app in development mode:
```bash
npm run dev -- --filter=web
```

## Deployment

Deploy all packages:
```bash
npm run deploy
```

Deploy specific package:
```bash
npm run deploy -- --filter=convex-functions
```

## Running the Migration

1. Update the migration script with your PostgreSQL connection details
2. Run the migration:
```bash
npm run migration
```

## Benefits of Migration

- Real-time capabilities with built-in subscriptions
- Serverless architecture with automatic scaling
- Simplified development with end-to-end TypeScript support
- Improved performance through automatic caching
