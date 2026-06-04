# Feature Spec: Shell auth (Neon Auth + API)

## Status

**In progress** — implementation through T2.3 done. **Blocked on [07-auth-e2e-gate.md](./07-auth-e2e-gate.md)** until sign-up, sign-in, and sign-out pass manually with Neon (not `DEV_AUTH_*`).

## Goal

Shell owns the full auth UX: Neon Auth **sign-up**, **sign-in**, and **sign-out**, API-backed profile hydration, and read-only `user` passed to remotes. No mock user fallback.

## User stories

1. As a **visitor**, I want to **sign up** or **sign in** in the shell before using catalog/cart remotes.
2. As a **signed-in user**, I want the shell nav to show my name and **sign out**.
3. As an **interviewer**, I want the host to demonstrate “session in shell, trust in API, props to remotes” with working code.

## Auth E2E gate (required before other features)

**Spec:** [07-auth-e2e-gate.md](./07-auth-e2e-gate.md)

Do not start new MFE features until sign-up, sign-in, and sign-out pass that checklist with real Neon env.

## Requirements

### Done (T1)

- [x] Shell loads profile from `apps/api` (`ApiUserProvider`, `fetchMe`) with `@repo/neon-auth` server verification on API
- [x] `fetchMe` uses `credentials: 'include'` for session cookies
- [x] No silent mock fallback on API failure — error UI + retry (transient / server errors)
- [x] `apps/shell/.env.example` lists `VITE_API_BASE_URL`, optional `VITE_NEON_AUTH_URL`
- [x] API dev path documented: `DEV_AUTH_*` on `apps/api` for local demo without a Neon Auth project

### Pending (T2)

- [x] Session states: `loading` | `unauthenticated` | `authenticated` | `error` (401 → `unauthenticated`, not `error`)
- [x] `reloadUser()` exposed via `useAuthSession()`; `AuthSessionSync` refreshes on Neon session change
- [x] Sign-up route `/sign-up` with `AuthView pathname="sign-up"`
- [x] Sign-in route `/sign-in` with `AuthView pathname="sign-in"`
- [x] Nav: Sign in / Sign up (unsigned) and Sign out (signed in, Neon only)
- [ ] `RemoteSlotProps.user` populated from authenticated session on `/products` and `/cart` (manual verify)
- [ ] Remotes unchanged — props-only, no auth SDK in remotes
- [ ] `@repo/neon-auth` `NeonAuthProvider` wraps Neon Auth UI provider when configured (passthrough when not)

## Out of scope

- `packages/mfe-auth` package
- Auth inside remotes
- Clerk / `@repo/auth`
- Route guards / protected-route middleware (separate spec if needed)
- Shell calling API from remotes

## Architecture impact

| Layer | Responsibility |
|-------|----------------|
| Neon Auth (browser) | Sign-in, sign-out, session cookie / token |
| Shell | Auth UI, session listeners, `GET /api/me`, `UserProvider` |
| `apps/api` | Verify session; canonical profile + DB user |
| Remotes | Read-only `user` prop from shell |

```txt
Browser → Neon Auth (sign-in) → session cookie
Browser → Shell → GET /api/me (credentials) → API → verify → Postgres
Shell → RemoteSlotProps.user → mfe-products / mfe-cart
```

Trust: only the API decides if a session is valid. The shell never treats client-only state as authenticated without a successful `/api/me`.

### Provider tree (target)

```txt
main.tsx
  MfeShellProvider          # theme, toasts — no auth
    NeonAuthProvider        # @repo/neon-auth — UI + client when VITE_NEON_AUTH_URL set
      App
        ApiUserProvider     # session-aware /api/me
          BrowserRouter
```

`MfeShellProvider` stays auth-free. `DesignSystemProvider` (Next apps) may use the same `NeonAuthProvider` slot.

## Environment matrix

| Mode | Shell | API | UX |
|------|-------|-----|-----|
| **Dev auth** | `VITE_API_BASE_URL` only | `DEV_AUTH_USER_ID` + `DEV_AUTH_EMAIL` | Auto-authenticated via `/api/me` (no Neon UI required) |
| **Real Neon** | + `VITE_NEON_AUTH_URL` | `NEON_AUTH_BASE_URL` + `NEON_AUTH_COOKIE_SECRET`, `CORS_ORIGIN` | Sign-in UI → cookie → `/api/me` |
| **Misconfigured** | API up, no session | Neon configured, no cookie | `unauthenticated` + sign-in CTA (not mock user) |

Shell `VITE_NEON_AUTH_URL` and API `NEON_AUTH_BASE_URL` must reference the **same** Neon Auth application.

See [02-api-application/auth-strategy.md](./02-api-application/auth-strategy.md) and [api-design.md](./02-api-application/api-design.md) for API contract and cross-system flow.

## Proposed file structure

```txt
apps/shell/
  .env.example
  src/
    app.tsx                          # + /sign-in route
    features/
      auth/
        components/
          api-user-provider.tsx      # extend: session states + refetch
          auth-nav.tsx               # sign-in / sign-out + display name
          sign-in-page.tsx           # Neon Auth UI
        hooks/
          use-auth-session.ts        # client session + signOut
        lib/
          api-client.ts
          api-types.ts
          map-api-user.ts
          neon-auth-client.ts
      shell-chrome/
        components/
          shell-layout.tsx           # use AuthNav instead of static badge

packages/neon-auth/
  src/
    provider.tsx                     # real NeonAuthProvider (was passthrough)
```

## Session state behavior

| State | When | Shell UI |
|-------|------|----------|
| `loading` | Initial mount; after sign-in/out before `/api/me` completes | Full-page or inline spinner (match T1 pattern) |
| `unauthenticated` | `/api/me` → 401 or no Neon session | Chrome visible; nav shows **Sign in**; main routes may redirect to `/sign-in` or show CTA |
| `authenticated` | `/api/me` → 200 | `UserProvider` + nav badge + **Sign out**; remotes receive `user` |
| `error` | Network failure, 5xx, misconfiguration (not 401) | Error message + retry (keep T1 behavior) |

**401 rule:** `UNAUTHORIZED` from `/api/me` maps to `unauthenticated`, not the generic error screen, so users get a sign-in path instead of only “Retry”.

## Acceptance criteria

### T1 (done)

- [x] With API + `DEV_AUTH_*`: shell shows user from `/api/me`
- [x] API unreachable / 5xx: error state (no mock user)

### T2 (pending E2E gate — [07-auth-e2e-gate.md](./07-auth-e2e-gate.md))

- [ ] **Sign up** — new account via `/sign-up` → `/api/me` 200
- [ ] **Sign in** — existing account via `/sign-in` → `/api/me` 200
- [ ] **Sign out** — session cleared → `/api/me` 401 → protected routes redirect
- [ ] `/products` and `/cart` receive correct `user` after sign-in
- [x] `cd apps/shell && bun run typecheck` passes

## Implementation tasks

### T1 — API user wiring (done)

- `apps/shell/.env.example`, `package.json` (`@repo/neon-auth`)
- `features/auth/lib/*`, `features/auth/components/api-user-provider.tsx`
- `app.tsx` — `ApiUserProvider` wraps router

### T2.1 — Session-aware `ApiUserProvider` (done)

- `auth-session-context.tsx`, `is-unauthorized-error.ts`
- `ApiUserProvider` — 401 → `unauthenticated`; `UserProvider` only when authenticated
- `AuthRequired` on `/products` and `/cart` → `/sign-in?from=…`
- `auth-nav.tsx`, placeholder `sign-in-page.tsx`

**Verify:** Dev auth still auto-loads user; with Neon only, unsigned state shows shell + sign-in path.

### T2.2 — `NeonAuthProvider` + session sync (done)

- `packages/neon-auth` — `NeonAuthProvider`, `NeonAuthClientProvider`, `useNeonAuthClient`, `@repo/neon-auth/ui`
- `main.tsx` — `NeonAuthProvider` + auth UI tailwind import
- `auth-session-sync.tsx` — `useSession` → `reloadUser()`

**Verify:** Passthrough when `VITE_NEON_AUTH_URL` unset.

### T2.3 — Nav + auth UI (done)

- `auth-nav.tsx` — Sign in / Sign up / Sign out
- `sign-in-page.tsx`, `sign-up-page.tsx` — shared `auth-view-page.tsx`

**Verify:** Sign-out only when Neon configured (hidden for API-only dev auth).

### T2.4 — Auth E2E gate (human — required)

Follow [07-auth-e2e-gate.md](./07-auth-e2e-gate.md). Mark complete when sign-up, sign-in, and sign-out all pass.

## Agent implementation prompt

Implement **one T2 subtask at a time** from this spec (e.g. “Implement T2.1 only”).

Before coding: read `apps/docs/AGENTS.md`, this spec, and [02-api-application/auth-strategy.md](./02-api-application/auth-strategy.md).

After coding: update this spec and `00-index.md`.

Do not implement route guards or remote-side auth unless the user expands scope.
