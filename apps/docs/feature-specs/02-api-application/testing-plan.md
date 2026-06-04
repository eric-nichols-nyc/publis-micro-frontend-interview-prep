# API Application — Testing Plan

## Test pyramid

```txt
                    ┌─────────────┐
                    │  E2E (few)  │  Playwright: shell sign-in → API me
                    └──────┬──────┘
               ┌────────────┴────────────┐
               │  Contract / HTTP (some) │  Supertest or fetch against test app
               └────────────┬────────────┘
          ┌──────────────────┴──────────────────┐
          │  Integration (some)               │  Real DB, migrate + seed
          └──────────────────┬──────────────────┘
     ┌───────────────────────┴───────────────────────┐
     │  Unit (many)                                   │  Services, middleware, repos (mocked)
     └────────────────────────────────────────────────┘
```

## Tooling

| Layer | Tool | Location |
|-------|------|----------|
| Unit | `bun:test` or Vitest | `apps/api/tests/unit/` |
| HTTP contract | Supertest or `app.fetch` (Hono) | `apps/api/tests/contract/` |
| Integration | `bun:test` + Prisma test DB | `apps/api/tests/integration/` |
| E2E | Playwright (existing spec **10**) | Extend when shell calls API |

**Runner:** `cd apps/api && bun test` (script added in T0.1).

## Unit tests

### Middleware

| Case | Expected |
|------|----------|
| No credential on protected route | 401 |
| Malformed Bearer | 401 |
| Mock valid auth | `context.user` set |
| `require-auth` without prior auth | 401 |

**File:** `tests/unit/middleware/auth.test.ts`

### UserService

| Case | Expected |
|------|----------|
| `getMe` — user exists | Returns DTO |
| `getMe` — auto provision | Repository `create` called once |
| `getUserById` — own id | Returns DTO |
| `getUserById` — other id | Throws `ForbiddenError` |
| `ensureProfile` — duplicate | Idempotent update |

**File:** `tests/unit/services/user.service.test.ts`

**Pattern:** Inject mock `UserRepository` interface.

### UserRepository (optional unit)

- Mock Prisma client with `prisma-mock` or manual stubs.
- Prefer integration tests for real query correctness.

## Integration tests

### Setup (`tests/helpers/db-setup.ts`)

1. Use `DATABASE_URL` pointing to isolated DB (Neon branch or local Docker Postgres).
2. Run `prisma migrate deploy` before suite (CI job step).
3. Run seed or truncate + insert fixtures between tests.

### Cases

| Test | Assert |
|------|--------|
| `findByAuthId` | Returns seeded user |
| `create` + `findById` | Round trip |
| Transaction rollback | Partial write not visible after forced error |

**File:** `tests/integration/user.repository.test.ts`

**CI:** Skip suite if `DATABASE_URL` unset (document in README).

## Contract / HTTP tests

### Harness (`tests/helpers/test-app.ts`)

- Import `app` from `src/app.ts` without listening on port.
- Apply `mock-auth` middleware override for authenticated cases.

### Route matrix

| Request | Status | Body check |
|---------|--------|------------|
| `GET /health` | 200 | `status`, `checks.database` |
| `GET /api/me` (no auth) | 401 | `error.code === UNAUTHORIZED` |
| `GET /api/me` (mock auth) | 200 | `email`, `authUserId` |
| `GET /api/users/1` (owner) | 200 | `id === 1` |
| `GET /api/users/2` (non-owner) | 403 | `FORBIDDEN` |
| `GET /api/users/999` | 404 | `NOT_FOUND` |
| `POST /api/users` valid body | 201 or 200 | `name` persisted |
| `POST /api/users` invalid name | 400 | `VALIDATION_ERROR` |
| `POST /api/users` with `email` in body | 400 | rejected field |

**File:** `tests/contract/routes.contract.test.ts`

## Auth testing without production Neon

| Strategy | Use |
|----------|-----|
| `mock-auth` helper | Unit + contract default |
| Signed JWT with test JWKS | Integration optional |
| Neon Auth test project | Pre-release manual check |

Document fixture JWT generation in `tests/helpers/mock-auth.ts` comments only (no real keys in repo).

## E2E (shell + API)

Extend spec **10-e2e-smoke** when T5 complete:

1. Start `bun run dev` (shell + api).
2. Sign in via Neon Auth test user (or bypass with test-only env if supported).
3. Assert nav shows email from API.
4. Visit `/products` — remote still loads with user prop.

**Out of v1 API-only PR** unless user requests E2E in same feature.

## Coverage targets (guidance)

| Area | Target |
|------|--------|
| `services/` | ≥ 90% lines |
| `middleware/auth` | 100% branches |
| `controllers/` | Covered via contract tests |
| `repositories/` | Integration tests for critical queries |

Not enforced by tooling in v1; optional `bun test --coverage` later.

## Test data

| Entity | Values |
|--------|--------|
| User A | `authUserId: auth_a`, `id: 1`, email `a@test.com` |
| User B | `authUserId: auth_b`, `id: 2`, email `b@test.com` |

Used for 403 cross-user tests.

## Negative and security tests

- [ ] SQL injection in `name` — Prisma parameterized; assert no error leak
- [ ] Oversized JSON body — 413 or 400
- [ ] Wrong `Content-Type` — 415 or 400
- [ ] CORS from disallowed origin — blocked in browser (manual or playwright)

## CI pipeline (recommended)

```txt
job api-test:
  - bun install
  - bun run migrate (test DATABASE_URL)
  - turbo run test --filter=api
  - turbo run typecheck --filter=api
```

## Local developer workflow

```sh
# Terminal 1
bun run dev --filter=api

# Terminal 2
cd apps/api && bun test

# Contract only
cd apps/api && bun test tests/contract
```

## Regression checklist (manual)

Before marking **Completed**:

1. `curl /health` — 200
2. Sign in on shell — `GET /api/me` returns profile
3. Cross-user GET — 403
4. `bun run build` at repo root includes api
5. No `DATABASE_URL` in any `VITE_*` variable in shell build
