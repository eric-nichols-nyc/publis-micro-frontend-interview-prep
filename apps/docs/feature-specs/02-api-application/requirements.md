# API Application — Requirements

## Functional requirements

### FR-1 — Health endpoint

- [ ] **FR-1.1** Expose `GET /health` (unauthenticated) returning service identity, version/build metadata, and dependency summary (DB reachable: yes/no).
- [ ] **FR-1.2** Return `200` when process is up; return `503` when critical dependency checks fail (configurable: strict in prod, lenient in dev).
- [ ] **FR-1.3** Response must not leak secrets (connection strings, API keys).

### FR-2 — Auth verification

- [ ] **FR-2.1** Every route under `/api/*` except an explicit public allowlist runs auth middleware.
- [ ] **FR-2.2** Accept session credentials via **HttpOnly cookie** (browser → shell → API) and optionally `Authorization: Bearer <token>` for tooling/CLI.
- [ ] **FR-2.3** Validate credentials with **Neon Auth** (JWKS / session introspection per Neon Auth server SDK—exact method chosen at implementation).
- [ ] **FR-2.4** On invalid or expired session: `401 Unauthorized` with stable error code; no partial handler execution.
- [ ] **FR-2.5** Attach resolved identity (`authUserId`, email, session id) to request context for downstream handlers.

### FR-3 — Current user endpoint

- [ ] **FR-3.1** `GET /api/me` returns the authenticated user’s profile combining Neon Auth identity and local DB record (if provisioned).
- [ ] **FR-3.2** If Neon Auth user exists but no DB row: create or return a provisioning payload per [database-strategy.md](./database-strategy.md#user-provisioning).
- [ ] **FR-3.3** Response shape is defined in [api-design.md](./api-design.md) and shared via `@repo/types`.

### FR-4 — Protected routes

- [ ] **FR-4.1** User resource routes (`GET /api/users/:id`, `POST /api/users`) require authentication.
- [ ] **FR-4.2** Authorization: callers may only read/update their own user record unless future RBAC grants admin role (see [auth-strategy.md](./auth-strategy.md#rbac-readiness)).
- [ ] **FR-4.3** `POST /api/users` is idempotent for “ensure profile exists” semantics for the current session (not open registration).

### FR-5 — Database access

- [ ] **FR-5.1** All persistence goes through `@repo/database` Prisma client inside repository modules—no raw SQL in route handlers.
- [ ] **FR-5.2** Migrations managed in `packages/database`; API never runs ad-hoc schema changes at runtime.
- [ ] **FR-5.3** Seed data available for local dev and CI integration tests.
- [ ] **FR-5.4** Use transactions for multi-step writes (see [database-strategy.md](./database-strategy.md)).

### FR-6 — Future-ready hooks (documented, not implemented in v1)

- [ ] **FR-6.1** Route namespace reserved: `/api/v1/*` (or version header) for backward-compatible growth.
- [ ] **FR-6.2** Extension point for `/api/ai/*` behind same auth + rate-limit middleware (stub only in v1).

## Non-functional requirements

### NFR-1 — Security

| ID | Requirement |
|----|-------------|
| NFR-1.1 | Secrets only in server env (`DATABASE_URL`, Neon Auth secrets); never in Vite `VITE_*` vars except public Neon Auth client ids. |
| NFR-1.2 | CORS allowlist: shell origin(s) only in production; no `*` with credentials. |
| NFR-1.3 | Helmet-style security headers on API responses. |
| NFR-1.4 | Input validation on all mutating endpoints (Zod at boundary). |
| NFR-1.5 | Rate limiting on auth and write endpoints (middleware placeholder acceptable in v1). |
| NFR-1.6 | Audit log hook for denied authorization (`403`) — structured log line minimum. |

### NFR-2 — Scalability

| ID | Requirement |
|----|-------------|
| NFR-2.1 | Stateless API processes (session in Neon Auth / cookie; no in-memory session store). |
| NFR-2.2 | Compatible with Neon serverless Postgres (existing Prisma Neon adapter). |
| NFR-2.3 | Health check suitable for load balancer / Vercel / Fly / Railway probes. |
| NFR-2.4 | Ready for horizontal scale: no required sticky sessions beyond cookie affinity at edge. |

### NFR-3 — Maintainability

| ID | Requirement |
|----|-------------|
| NFR-3.1 | Layered architecture: routes → controllers → services → repositories (see [architecture.md](./architecture.md)). |
| NFR-3.2 | One feature per service module; repositories per aggregate (`user`). |
| NFR-3.3 | Shared DTOs in `@repo/types`; no duplicate interfaces in shell and API. |
| NFR-3.4 | Typed environment config module (`src/config/env.ts`) validated at boot. |

### NFR-4 — Observability

| ID | Requirement |
|----|-------------|
| NFR-4.1 | Structured JSON logs (request id, route, status, duration, user id hash). |
| NFR-4.2 | Error taxonomy: `code`, `message`, `details` (dev-only), `requestId`. |
| NFR-4.3 | Optional OpenTelemetry / Sentry integration point in `src/config` (not required v1). |
| NFR-4.4 | Health endpoint exposes DB ping latency for operators. |

### NFR-5 — Testability

| ID | Requirement |
|----|-------------|
| NFR-5.1 | Unit tests for services and repositories with mocked Prisma. |
| NFR-5.2 | Integration tests against test DB or Prisma test harness. |
| NFR-5.3 | HTTP contract tests for `/health`, `/api/me`, user routes. |
| NFR-5.4 | Auth middleware testable with injected verifier (no live Neon in unit tests). |

## Out of scope (v1)

- GraphQL or tRPC public API
- WebSockets / SSE (except Neon adapter internal WS)
- Direct MFE → API calls
- Full RBAC admin APIs
- AI inference pipelines
- Replacing `@repo/auth` Clerk exports in other apps (document migration path only)
- Email webhooks / Neon Auth sync workers (future)

## Assumptions

- Monorepo uses **Bun** for scripts; API runtime **Node 20+** or **Bun** (choose one at implementation; spec requires TypeScript).
- HTTP framework: **Hono** or **Express** (implementation plan recommends Hono for size + middleware ergonomics).
- Neon Auth is the identity provider of record for this feature (see [auth-strategy.md](./auth-strategy.md) for Clerk coexistence note).

## Open decisions

| # | Decision | Default if unresolved |
|---|----------|------------------------|
| OD-1 | API dev port | `3001` |
| OD-2 | API path prefix in prod | Same host `/api` via reverse proxy vs subdomain `api.example.com` |
| OD-3 | Auto-provision DB user on first `GET /api/me` | Yes in dev; configurable in prod |

Record resolutions in this file when approved.
