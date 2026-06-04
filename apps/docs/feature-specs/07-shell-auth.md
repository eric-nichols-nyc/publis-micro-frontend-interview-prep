# Feature Spec: Shell auth (Clerk)

## Status

**Draft** — approve when ready to replace mock user; requires Clerk env vars.

## Goal

Replace mock `UserProvider` with `@repo/auth` (Clerk) in the shell while remotes still receive read-only user via props.

## User story

As a signed-in user, I want the shell to reflect my real session so interview answers about “auth in the host” match working code.

## Requirements

- [ ] Shell uses `@repo/auth` provider pattern from `@repo/design-system` / `@repo/auth` (follow existing package APIs)
- [ ] Remove `mockUser` default in shell for production path; keep dev fallback only if env missing (document in spec implementation)
- [ ] `RemoteSlotProps.user` populated from Clerk session (map to `User` type in `mfe-shared`)
- [ ] Sign-in / sign-out entry in shell nav (Clerk components or links)
- [ ] Remotes unchanged — still props-only, no Clerk SDK in remotes
- [ ] `.env.example` in `apps/shell` listing required Clerk keys

## Out of scope

- `packages/mfe-auth` package
- Auth inside remotes
- Database user sync
- Route protection middleware (optional nice-to-have — separate task)

## Architecture impact

- Apps: `shell`
- Packages: `@repo/auth`, possibly `@repo/design-system` if provider combined
- New package: no

## Proposed file structure

```txt
apps/shell/
  .env.example
  src/
    features/auth/
      components/
        shell-user-menu.tsx
      lib/
        map-clerk-user.ts
    context/
      user-context.tsx          # refactor to consume Clerk or thin wrapper
```

## Acceptance criteria

- [ ] With valid env: shell shows signed-in user; remotes receive mapped `user`
- [ ] Without env: graceful message (no crash) per repo “degrade gracefully” rule
- [ ] `typecheck` passes on shell

## Implementation tasks

### T1 — Env and provider wiring

Files:

- `apps/shell/.env.example`
- `apps/shell/package.json` — `@repo/auth`
- `apps/shell/src/main.tsx` or `app.tsx` provider tree

Verify:

- App boots with env documented

### T2 — Map session to User + nav UI

Files:

- `map-clerk-user.ts`, `shell-user-menu.tsx`, update `UserProvider` / `useUser`

Verify:

- Remotes still show user on `/products` and `/cart`

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/07-shell-auth.md`.

Before coding: read `apps/docs/AGENTS.md`, `progress-tracker.md`, this spec.

After coding: update `progress-tracker.md`; stop before T2.
