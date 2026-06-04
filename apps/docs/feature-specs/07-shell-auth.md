# Feature Spec: Shell auth (Neon Auth + API)

## Status

**In progress** — user loads via `GET /api/me` + dev auth; Neon sign-in UI (T2) pending.

## Goal

Replace mock `UserProvider` with Neon Auth session + API-backed profile in the shell while remotes still receive read-only user via props.

## User story

As a signed-in user, I want the shell to reflect my real session so interview answers about “auth in the host” match working code.

## Requirements

- [x] Shell loads user from `apps/api` (`ApiUserProvider`, `fetchMe`) with `@repo/neon-auth` server verification on API
- [x] No silent mock fallback on API failure — error UI + retry
- [ ] `RemoteSlotProps.user` populated from authenticated session (map to `User` in `mfe-shared`) — verify on all routes
- [ ] Sign-in / sign-out entry in shell nav (Neon Auth UI or links)
- [ ] Remotes unchanged — still props-only, no auth SDK in remotes
- [ ] `.env.example` in `apps/shell` listing `VITE_API_BASE_URL`, optional `VITE_NEON_AUTH_URL`, dev auth vars on API

## Out of scope

- `packages/mfe-auth` package
- Auth inside remotes
- Clerk / `@repo/auth`
- Route protection middleware (optional nice-to-have — separate task)

## Architecture impact

- Apps: `shell`, `api`
- Packages: `@repo/neon-auth`, `@repo/mfe-shared`, `@repo/database`
- Design system: `MfeShellProvider` (no auth wrapper); `DesignSystemProvider` uses `NeonAuthProvider` passthrough

## Proposed file structure

```txt
apps/shell/
  .env.example
  src/
    features/auth/
      api-client.ts
      api-user-provider.tsx
      map-api-user.ts
      neon-auth-client.ts
```

## Acceptance criteria

- [x] With API + dev auth env: shell shows user from `/api/me`
- [x] API failure: error state (no mock user)
- [ ] With Neon Auth UI env: real sign-in flow
- [ ] `typecheck` passes on shell

## Implementation tasks

### T1 — API user wiring (done)

Files:

- `apps/shell/.env.example`
- `apps/shell/package.json` — `@repo/neon-auth`
- `apps/shell/src/app.tsx` — `ApiUserProvider`

### T2 — Neon sign-in UI + nav

Files:

- `neon-auth-client.ts`, shell nav sign-in/out
- Optional `NeonAuthUIProvider` in provider tree when `VITE_NEON_AUTH_URL` set

Verify:

- Remotes still show user on `/products` and `/cart`

## Agent implementation prompt

Implement **T2 only** from `apps/docs/feature-specs/07-shell-auth.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update this spec and `00-index.md` if needed.
