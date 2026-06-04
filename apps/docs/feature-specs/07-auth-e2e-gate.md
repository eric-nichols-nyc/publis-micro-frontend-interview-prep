# Auth E2E gate (sign-up · sign-in · sign-out)

## Status

**Required** — no further MFE feature work until this gate passes on branch `feature/shell-auth` (see parent spec [07-shell-auth.md](./07-shell-auth.md)).

## Why this exists

The interview story depends on a **real host-owned session**:

1. Visitor can **sign up** and **sign in** in the shell (not in remotes).
2. API **`GET /api/me`** is the source of truth after Neon sets the cookie.
3. Shell passes **`user`** into federated remotes on `/products` and `/cart`.
4. **Sign out** clears the session; protected routes and remotes no longer see a user.

`DEV_AUTH_*` on the API is for federation-only demos. It **does not** satisfy this gate.

## Environment (required)

Shell (`apps/shell/.env`):

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_NEON_AUTH_URL=https://<project>.neonauth.<region>.aws.neon.tech/<db>/auth
```

API (`apps/api/.env`):

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173
NEON_AUTH_BASE_URL=<same URL as VITE_NEON_AUTH_URL>
NEON_AUTH_COOKIE_SECRET=<32+ chars from Neon console>
# DEV_AUTH_* must be commented out or removed
```

Database: `DATABASE_URL` in `packages/database/.env`; run `bun run migrate` if needed.

Restart after env changes:

```sh
bun run dev
```

## MFE routes (shell only)

| Route | Purpose |
|-------|---------|
| `/sign-up` | Neon `AuthView` — create account |
| `/sign-in` | Neon `AuthView` — existing account |
| `/products`, `/cart` | `AuthRequired` → redirect to `/sign-in?from=…` when unsigned |
| `/` | Public while unsigned |

Remotes must **not** import `@neondatabase/auth` or call `apps/api` directly.

## Two stores (do not confuse them)

| Store | What writes to it | When |
|-------|-------------------|------|
| **Neon Auth tables** | Neon Auth service (`VITE_NEON_AUTH_URL`) | Sign-up / sign-in via `AuthView` on `/sign-up`, `/sign-in` |
| **Prisma `User` table** | `apps/api` `ensureUserProfile()` | First successful **`GET /api/me`** after auth |

Sign-up does **not** call `apps/api`. The shell calls `GET /api/me` (see `fetchMe` in `api-client.ts`) with the Neon session **Bearer** token so the API on `:3001` can verify and create the app user row.

## Manual test script (check every box)

### A — Sign up (new user)

- [ ] Open http://localhost:5173 — nav shows **Sign in** / **Sign up** (not auto “Signed in as …”)
- [ ] Open **Sign up** (`/sign-up`) — Neon registration form renders
- [ ] Complete sign-up — redirected to return path (default `/`)
- [ ] Nav shows **Signed in as …** and **Sign out**
- [ ] `curl -b cookies.txt` not required; browser: DevTools → Network → `GET /api/me` returns **200** with your email

### B — Sign in (existing user)

- [ ] **Sign out** (see C), then open **Sign in** (`/sign-in`)
- [ ] Sign in with same account — nav shows user again
- [ ] Open **Products** — remote loads; UI shows user context from shell (not a separate login)

### C — Sign out

- [ ] Click **Sign out** — nav returns to **Sign in** / **Sign up**
- [ ] Open **Products** — redirect to `/sign-in?from=/products` (no remote catalog with stale user)
- [ ] Optional: DevTools → `GET /api/me` returns **401**
- [ ] After sign-up: DevTools → `GET http://localhost:3001/api/me` returns **200** (creates Prisma `User` row)

### D — MFE deep link

- [ ] While signed out, visit `/products` directly — lands on sign-in with return to products
- [ ] Sign in — returns to `/products` with remote + `user` prop

## Pass criteria

All boxes in **A–D** checked on one machine with Neon Auth env (not `DEV_AUTH_*`).

When passed:

1. Mark gate complete in [07-shell-auth.md](./07-shell-auth.md) (Status + T2.4).
2. Update [00-index.md](./00-index.md) note: auth E2E gate passed.
3. Other feature specs may proceed (catalog polish, cross-MFE cart, etc.).

## Failures

| Symptom | Fix |
|---------|-----|
| Always signed in, no sign out | API still using `DEV_AUTH_*` or missing Neon server env |
| Sign-up UI blank / error | `VITE_NEON_AUTH_URL` wrong; import `@repo/neon-auth/styles/auth-ui` in shell `main.tsx` |
| `/api/me` 401 after sign-in | `NEON_AUTH_BASE_URL` must match shell URL; check `NEON_AUTH_COOKIE_SECRET` |
| CORS error | `CORS_ORIGIN=http://localhost:5173` on API |

## Related specs

- [07-shell-auth.md](./07-shell-auth.md) — implementation
- [02-api-application/auth-strategy.md](./02-api-application/auth-strategy.md) — API verification
