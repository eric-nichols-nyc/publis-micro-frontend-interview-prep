# API Application — Implementation Plan

Planning tasks only. **Do not implement multiple tasks in one agent session** unless the user explicitly requests it.

## Prerequisites

- [ ] Approve spec: set **Draft** → **Approved** in [overview.md](./overview.md) and [00-index.md](../00-index.md).
- [ ] Neon project: Postgres database + Neon Auth application configured.
- [ ] Env templates committed (no secrets): `packages/database/.env.example`, `apps/api/.env.example`, `apps/shell/.env.example` updates.

## Phase 0 — Workspace scaffolding

### T0.1 — Create `apps/api` package

**Files:**

- `apps/api/package.json` — name `@repo/api` or `api`, depends on `@repo/database`, `@repo/typescript-config`
- `apps/api/tsconfig.json`
- `apps/api/src/main.ts`, `src/app.ts` (minimal listen + `/health` stub)
- Root `turbo.json` pipeline entries for `dev`, `build`, `typecheck`, `test`

**Verify:**

- `cd apps/api && bun run dev` listens on port 3001
- `curl http://localhost:3001/health` returns JSON

### T0.2 — Create `@repo/types` package

**Files:**

- `packages/types/package.json`
- `packages/types/src/api/me.ts`, `users.ts`, `errors.ts`, `health.ts`
- `packages/types/src/index.ts`

**Verify:**

- `bun run typecheck` in `packages/types`

## Phase 1 — Database

### T1.1 — Extend Prisma User model

**Files:**

- `packages/database/prisma/schema.prisma` — add `authUserId`, `updatedAt`
- New migration under `packages/database/prisma/migrations/`

**Verify:**

- `bun run migrate` succeeds locally
- `prisma generate` updates client

### T1.2 — Seed script

**Files:**

- `packages/database/prisma/seed.ts`
- Wire seed in `package.json` prisma config

**Verify:**

- `bunx prisma db seed` creates test users

## Phase 2 — API core layers

### T2.1 — Config and middleware

**Files:**

- `apps/api/src/config/env.ts`
- `apps/api/src/middleware/request-id.ts`, `cors.ts`, `security-headers.ts`, `error-handler.ts`
- `apps/api/.env.example`

**Verify:**

- Invalid env fails boot with clear message
- CORS preflight from shell origin succeeds in dev

### T2.2 — DB client and transaction helper

**Files:**

- `apps/api/src/db/client.ts`, `transaction.ts`

**Verify:**

- Integration test connects to DB (or skip in CI without `DATABASE_URL`)

### T2.3 — User repository

**Files:**

- `apps/api/src/repositories/user.repository.ts`
- `apps/api/src/types/domain/user.ts`

**Verify:**

- Unit test with mocked Prisma client

## Phase 3 — Auth

### T3.1 — Neon Auth server verification

**Files:**

- `packages/auth/server.ts` (refactor from Clerk) or new neon auth module
- `apps/api/src/middleware/auth.ts`, `require-auth.ts`
- `apps/api/src/types/context.ts`

**Verify:**

- Request without cookie → 401 on `/api/me`
- Valid test token → context populated (mock or real Neon test project)

### T3.2 — Auth test helpers

**Files:**

- `apps/api/tests/helpers/mock-auth.ts`

**Verify:**

- Unit tests run without network

## Phase 4 — Endpoints

### T4.1 — Health

**Files:**

- `health.service.ts`, `health.controller.ts`, `health.routes.ts`

**Verify:**

- `GET /health` returns DB check
- DB down → 503 in strict mode (test via mock)

### T4.2 — GET /api/me

**Files:**

- `user.service.ts` — `getMe`, provisioning
- `me.controller.ts`, `me.routes.ts`

**Verify:**

- Authenticated request returns merged profile
- First call creates DB row when auto-provision on

### T4.3 — GET /api/users/:id

**Files:**

- `users.controller.ts`, `users.routes.ts`
- Service authorization for ownership

**Verify:**

- Own id → 200
- Other id → 403
- Missing id → 404

### T4.4 — POST /api/users

**Files:**

- `user.service.ts` — `ensureProfile`
- Validation schema in `utils/validate.ts`

**Verify:**

- Idempotent second POST returns 200
- Invalid body → 400

## Phase 5 — Shell integration (coordination with spec 07)

### T5.1 — API client in shell

**Files:**

- `apps/shell/src/features/auth/lib/api-client.ts` (or similar)
- `apps/shell/.env.example` — `VITE_API_BASE_URL`

**Verify:**

- Signed-in user: shell displays name from `GET /api/me`
- Remotes still receive `user` prop

### T5.2 — Neon Auth client in shell

**Files:**

- Per [auth-strategy.md](./auth-strategy.md); may overlap spec **07**

**Verify:**

- End-to-end: sign-in → `/api/me` → products route shows user

## Phase 6 — Hardening

### T6.1 — Rate limit stub

**Files:**

- `middleware/rate-limit.ts`

**Verify:**

- Excessive POST returns 429 (test with low threshold)

### T6.2 — Logging

**Files:**

- `config/logger.ts` — structured request logs

**Verify:**

- Each request logs method, path, status, duration, requestId

### T6.3 — Documentation and turbo dev

**Files:**

- `apps/api/README.md`
- Root `package.json` — optional `dev` includes api filter

**Verify:**

- `bun run dev` starts shell + remotes + api (document ports)

## Phase 7 — CI

### T7.1 — Test scripts in CI

**Files:**

- `.github/workflows/*` or turbo test pipeline

**Verify:**

- PR runs `api` unit + contract tests
- Migrate + seed job for integration (if DATABASE_URL secret present)

## Dependency graph

```txt
T0.1, T0.2
    → T1.1 → T1.2
    → T2.1 → T2.2 → T2.3
    → T3.1 → T3.2
    → T4.1 → T4.2 → T4.3 → T4.4
    → T5.1, T5.2 (shell; after T4.2)
    → T6.* → T7.1
```

## Agent implementation prompt (template)

```text
Implement T4.2 only from apps/docs/feature-specs/02-api-application/implementation-plan.md.

Before coding:
1. Read apps/docs/AGENTS.md
2. Read 02-api-application/overview.md, api-design.md, auth-strategy.md, database-strategy.md

After coding:
1. Update implementation-plan.md checkboxes if used
2. Update 00-index.md status if feature completed
3. Stop before the next task unless the user asks to continue
```

## Estimated scope (portfolio)

| Phase | Relative effort |
|-------|-----------------|
| 0–1 | Small |
| 2–4 | Medium (core value) |
| 5 | Medium (shell coupling) |
| 6–7 | Small |

Total: suitable for 2–4 focused implementation sessions after approval.
