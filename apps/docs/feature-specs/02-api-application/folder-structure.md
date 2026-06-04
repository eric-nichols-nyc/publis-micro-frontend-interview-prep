# API Application — Folder Structure

## App root

```txt
apps/api/
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── src/
│   ├── main.ts                 # HTTP server bootstrap
│   ├── app.ts                  # Framework app + global middleware
│   ├── config/
│   │   ├── env.ts              # Zod-validated environment
│   │   ├── cors.ts
│   │   └── logger.ts
│   ├── middleware/
│   │   ├── request-id.ts
│   │   ├── cors.ts
│   │   ├── security-headers.ts
│   │   ├── auth.ts             # Neon Auth verification
│   │   ├── require-auth.ts
│   │   ├── rate-limit.ts       # v1 stub or light limiter
│   │   └── error-handler.ts
│   ├── routes/
│   │   ├── index.ts            # Mount all routers
│   │   ├── health.routes.ts
│   │   ├── me.routes.ts
│   │   └── users.routes.ts
│   ├── controllers/
│   │   ├── health.controller.ts
│   │   ├── me.controller.ts
│   │   └── users.controller.ts
│   ├── services/
│   │   ├── user.service.ts
│   │   └── health.service.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── db/
│   │   ├── client.ts           # @repo/database re-export
│   │   └── transaction.ts
│   ├── types/
│   │   ├── context.ts          # AuthenticatedContext
│   │   ├── errors.ts           # AppError, codes
│   │   └── domain/
│   │       └── user.ts
│   └── utils/
│       ├── http-response.ts
│       └── validate.ts         # Zod helpers for controllers
└── tests/
    ├── unit/
    │   ├── services/
    │   └── middleware/
    ├── integration/
    │   ├── user.repository.test.ts
    │   └── api.me.test.ts
    ├── contract/
    │   └── routes.contract.test.ts
    └── helpers/
        ├── test-app.ts         # Supertest / fetch harness
        ├── mock-auth.ts
        └── db-setup.ts
```

## Naming conventions

| Item | Convention | Example |
|------|------------|---------|
| Files | **kebab-case** | `user.service.ts`, `error-handler.ts` |
| Folders | **kebab-case** | `repositories/`, `middleware/` |
| Classes / types | **PascalCase** | `UserService`, `MeResponse` |
| Functions | **camelCase** | `getMe`, `verifySession` |

Aligns with [apps/docs/AGENTS.md](../../AGENTS.md) spirit; API uses technical layers (not `features/`) because the app is a single bounded context server.

## Package workspace layout (related)

```txt
packages/
├── database/                   # Prisma schema, migrations, seed
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── index.ts
├── types/                      # NEW — shared API DTOs
│   ├── src/
│   │   ├── api/
│   │   │   ├── me.ts
│   │   │   ├── users.ts
│   │   │   └── errors.ts
│   │   └── index.ts
│   └── package.json
└── auth/                       # EVOLVE — Neon Auth server + client helpers
    ├── server.ts
    ├── client.ts
    └── keys.ts
```

## Entry points

| File | Role |
|------|------|
| `main.ts` | Read `env`, create server, listen on `PORT` |
| `app.ts` | Register middleware + routes; export app for tests |
| `routes/index.ts` | `app.route('/health', healthRouter)` etc. |

## Environment files

```txt
apps/api/.env.example
# PORT=3001
# DATABASE_URL=          # or inherit via packages/database keys
# NEON_AUTH_*            # per Neon Auth project
# CORS_ORIGIN=http://localhost:5173
# NODE_ENV=development
```

Shell:

```txt
apps/shell/.env.example
# VITE_API_BASE_URL=http://localhost:3001
# VITE_NEON_AUTH_*       # public client config only
```

## Turbo / root scripts (when implemented)

```json
{
  "scripts": {
    "dev:api": "turbo run dev --filter=api",
    "dev": "turbo run dev --filter=shell --filter=mfe-products --filter=mfe-cart --filter=api"
  }
}
```

## What not to put in `apps/api`

- React components or Vite config
- Prisma schema files (stay in `packages/database`)
- Federation `remoteEntry.js` assets
- Frontend-only `VITE_*` secrets

## Growth pattern (new domain)

When adding e.g. cart persistence:

```txt
src/
  routes/cart.routes.ts
  controllers/cart.controller.ts
  services/cart.service.ts
  repositories/cart.repository.ts
  types/domain/cart.ts
```

No change to `main.ts` beyond route registration import.
