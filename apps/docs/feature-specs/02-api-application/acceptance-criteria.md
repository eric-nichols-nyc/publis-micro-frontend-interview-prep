# API Application — Acceptance Criteria

Measurable conditions for marking this feature **Completed** in [00-index.md](../00-index.md). Each item must be demonstrable (command output, test run, or recorded manual step).

## A1 — Application exists and runs

- [ ] **A1.1** `apps/api` is registered in the monorepo workspace and Turborepo pipeline.
- [ ] **A1.2** `bun run dev` (or documented `dev:api`) starts API on port **3001** without manual edits.
- [ ] **A1.3** `bun run typecheck --filter=api` passes with zero errors.
- [ ] **A1.4** `bun run build --filter=api` produces runnable `dist/` or documented Bun entry.

## A2 — Health endpoint

- [ ] **A2.1** `GET http://localhost:3001/health` returns **200** with JSON containing `status`, `service`, and `checks.database`.
- [ ] **A2.2** When database is unreachable (simulated or stopped), health returns **503** or `status: degraded` per [api-design.md](./api-design.md).
- [ ] **A2.3** Response contains no secrets (no `DATABASE_URL`, tokens, or stack traces in production mode).

## A3 — Authentication

- [ ] **A3.1** `GET /api/me` without credentials returns **401** with `error.code: UNAUTHORIZED`.
- [ ] **A3.2** Valid Neon Auth session (cookie or Bearer) allows access to protected routes.
- [ ] **A3.3** Auth middleware attaches `authUserId` used by services—not client-supplied ids from body/query alone.
- [ ] **A3.4** Unit tests cover auth middleware success and failure without live Neon (mock verifier).

## A4 — Current user endpoint

- [ ] **A4.1** `GET /api/me` returns **200** with fields: `id`, `authUserId`, `email`, `name`, `role`, `createdAt`, `updatedAt`.
- [ ] **A4.2** First authenticated call for a new Neon user creates a DB row when auto-provision is enabled (visible in DB or via second identical response).
- [ ] **A4.3** Response shape is exported from `@repo/types` and matches [api-design.md](./api-design.md).

## A5 — User resource endpoints

- [ ] **A5.1** `GET /api/users/:id` returns **200** when `:id` is the caller’s internal id.
- [ ] **A5.2** `GET /api/users/:id` returns **403** when `:id` belongs to another user.
- [ ] **A5.3** `GET /api/users/:id` returns **404** for non-existent id.
- [ ] **A5.4** Invalid `:id` (non-numeric) returns **400** with `VALIDATION_ERROR`.
- [ ] **A5.5** `POST /api/users` with valid optional `name` returns **201** or **200** and persists profile linked to session `authUserId`.
- [ ] **A5.6** `POST /api/users` rejecting `email` or `role` in body (ignored or 400).

## A6 — Database and packages

- [ ] **A6.1** Prisma schema includes `authUserId` (unique) and `updatedAt` on `User`.
- [ ] **A6.2** Migration applied via `bun run migrate` without manual SQL hacks.
- [ ] **A6.3** Seed script runs and creates at least two users for authorization tests.
- [ ] **A6.4** All DB access from API goes through repository layer (grep audit: no `database.` in `routes/` or `controllers/`).

## A7 — Architecture and security

- [ ] **A7.1** Folder layout matches [folder-structure.md](./folder-structure.md) (config, middleware, routes, controllers, services, repositories, db, types, utils, tests).
- [ ] **A7.2** CORS allows shell origin `http://localhost:5173` with credentials in dev.
- [ ] **A7.3** Security headers middleware enabled on API responses.
- [ ] **A7.4** Global error handler returns consistent `error` envelope with `requestId`.
- [ ] **A7.5** `.env.example` files document required vars; no committed secrets.

## A8 — Shell integration (minimum)

- [ ] **A8.1** Shell can call `GET /api/me` using `VITE_API_BASE_URL` after sign-in.
- [ ] **A8.2** Shell `UserProvider` (or successor) hydrates from API response mapped to `@repo/mfe-shared` `User`.
- [ ] **A8.3** Micro-frontends still receive user via props only (no new Prisma/Neon imports in remotes).

## A9 — Testing

- [ ] **A9.1** `bun test` in `apps/api` passes locally.
- [ ] **A9.2** Contract tests cover `/health`, `/api/me`, `/api/users/:id`, `POST /api/users` status codes in [testing-plan.md](./testing-plan.md).
- [ ] **A9.3** UserService unit tests cover provision, forbidden access, and not-found paths.

## A10 — Documentation and process

- [ ] **A10.1** All files in `02-api-application/` reflect implemented behavior (drift corrected).
- [ ] **A10.2** [00-index.md](../00-index.md) status updated to **Completed** when A1–A9 satisfied.
- [ ] **A10.3** `apps/api/README.md` documents dev ports, env vars, migrate/seed, and curl examples for four endpoints.

## RBAC readiness (design-only for v1 — not blocking Completed)

- [ ] **A11.1** `AuthenticatedContext.roles` array exists (default `["user"]`).
- [ ] **A11.2** `User.role` column present in schema.
- [ ] **A11.3** [auth-strategy.md](./auth-strategy.md) documents future policy layer—no admin routes required yet.

## Sign-off template

| Role | Date | Notes |
|------|------|-------|
| Author | | |
| Reviewer | | |

**Completed when:** All sections **A1–A10** checked; **A11** recommended but not required for initial merge.
