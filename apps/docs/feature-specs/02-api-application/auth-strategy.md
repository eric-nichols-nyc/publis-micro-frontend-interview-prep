# API Application — Auth Strategy

## Identity provider: Neon Auth

**Decision:** Use **Neon Auth** as the system of record for user identity, aligned with **Neon Postgres** in the same platform story.

### Repo context

- `@repo/auth` currently re-exports **Clerk** (`@clerk/nextjs/server`). This spec does **not** require Clerk for the API.
- **Migration path:** Refactor `@repo/auth` into Neon Auth–aware `client.ts` (browser) and `server.ts` (API verification) without breaking unrelated Next.js apps in the monorepo—or add `packages/neon-auth` if separation is cleaner (record choice in OD log).

### Neon Auth responsibilities

| Layer | Responsibility |
|-------|----------------|
| Neon Auth | Sign-up, sign-in, OAuth, session issuance, JWT/signing keys |
| Shell (browser) | Neon Auth React/SDK; stores session cookie or token |
| API | Verify every protected request; never trust client-sent `userId` without verification |

## Session validation (API)

### Middleware: `auth.ts`

1. Extract credential:
   - Primary: session **cookie** set by Neon Auth (name TBD per SDK docs at implementation).
   - Secondary: `Authorization: Bearer <access_token>` for API clients and tests.
2. Verify via Neon Auth server API:
   - Validate JWT signature against JWKS **or**
   - Call session introspection endpoint **or**
   - Use official Neon Auth server middleware helper when available.
3. On success, set `AuthenticatedContext`:

```ts
type AuthenticatedContext = {
  authUserId: string;      // stable subject from Neon Auth
  email: string;
  sessionId?: string;
  roles: string[];         // v1: ["user"]; future RBAC
  rawClaims: Record<string, unknown>; // avoid logging in prod
};
```

4. On failure: short-circuit `401` — do not invoke controller.

### Middleware: `require-auth.ts`

- Asserts `context.user` exists.
- Used on `/api/me` and `/api/users/*`.
- Composes after `auth.ts` on protected routers.

## Protected routes

| Route | Auth |
|-------|------|
| `GET /health` | Public |
| `GET /api/me` | Required |
| `GET /api/users/:id` | Required + ownership |
| `POST /api/users` | Required (ensure profile for self) |

### Public allowlist (v1)

- `GET /health`
- Optional future: `GET /api/v1/public/*` with no credentials

## Current user resolution

```txt
GET /api/me
  → auth middleware (Neon Auth claims)
  → UserService.getMe(authUserId)
      → UserRepository.findByAuthId(authUserId)
      → if missing: provision (see database-strategy)
  → merge Auth profile + DB fields → MeResponse
```

**Shell usage:** After Neon Auth sign-in, shell calls `GET /api/me` once (or on session change) and maps response to `@repo/mfe-shared` `User` for `RemoteSlotProps`.

## Authorization (resource-level)

### v1 — ownership model

| Action | Rule |
|--------|------|
| `GET /api/users/:id` | Allowed if `:id` matches DB user linked to `authUserId` |
| `POST /api/users` | Body must not request a different `authUserId`; creates/updates row for caller only |
| Admin read all users | **Denied** until RBAC |

### Future RBAC readiness

Design hooks (implement later):

1. **DB:** `User.role` already exists in Prisma stub (`default("user")`); extend enum: `user | admin | support`.
2. **Claims:** Map Neon Auth organization roles or custom claims → `context.user.roles[]`.
3. **Policy layer:** `src/services/authorization/policies.ts`

```ts
// Future shape
can(user: AuthenticatedContext, action: Action, resource: Resource): boolean
```

4. **Middleware:** `require-role('admin')` on admin routes only.
5. **Avoid** scattering `if (role === 'admin')` in controllers—centralize in policy service.

```txt
roles (v2+)
  user   → own resources only
  admin  → read/write all users (audited)
  support → read-only impersonation (future)
```

## CORS and cookies

- API sets `Access-Control-Allow-Credentials: true` for shell origin.
- Cookie attributes: `Secure`, `SameSite=Lax` (or `None` + Secure if shell/API on different sites with documented tradeoff).
- Prefer **same-site** deployment in production (shell and API under one registrable domain) to simplify cookie behavior.

## Clerk coexistence (interview repo)

| App | v1 demo | Target |
|-----|---------|--------|
| MFE shell | Mock user / spec 07 Clerk | Neon Auth client + API |
| API | N/A today | Neon Auth verification only |

Do not run dual verification (Clerk + Neon) on the same route. Pick one provider per environment.

## Security checklist

- [ ] Reject unsigned or expired tokens without fallback identity.
- [ ] Constant-time comparison not required for JWT ids; do not leak *why* token failed in prod (`invalid_session` only).
- [ ] Rotate JWKS on schedule; cache keys with TTL in API process.
- [ ] Never log raw Bearer tokens.
- [ ] Map `authUserId` → internal DB `id` in service layer; expose internal `id` in API only where needed.

## Testing auth

- `tests/helpers/mock-auth.ts` injects `AuthenticatedContext` bypassing Neon in unit tests.
- Contract tests use test Neon Auth project or signed fixture JWT with test keys.
- Document `NEON_AUTH_TEST_MODE` env for CI if provider supports it.
