# Architecture

## System overview

```txt
                    ┌─────────────────────────────────────┐
                    │  apps/shell (host) :5173            │
                    │  React Router, nav, fetch /api/me   │
                    │  ErrorBoundary + loadRemote fallbacks │
                    └──────────────┬──────────────────────┘
                                   │ Module Federation
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
    mfe_products:5174    mfe_cart:5175      @repo/mfe-shared
    ./ProductsPage         ./CartWidget       types, tokens,
                                              federationShared

    apps/shell ──HTTP──▶ apps/api :3001 ──▶ @repo/neon-auth, @repo/database
```

## Domain split

| Domain | App | Expose | Team story (interview) |
|--------|-----|--------|-------------------------|
| Catalog | `mfe-products` | `ProductsPage` | Owns product listing |
| Cart | `mfe-cart` | `CartWidget` | Owns checkout summary |
| Shell | `shell` | (consumes remotes) | Owns chrome, routing, session (via API) |
| API | `api` | REST (`/health`, `/api/me`, …) | Auth verify + Postgres (not a remote) |

## Shared packages (required)

| Package | Role |
|---------|------|
| `@repo/mfe-shared` | `User`, `RemoteSlotProps`, `mockUser`, `tokens.css`, `federationShared` |
| `@repo/typescript-config` | TS bases for apps |

### Optional later (not in repo yet)

| Package | When |
|---------|------|
| `packages/mfe-auth` | Real session helpers shared beyond shell |
| `packages/mfe-contracts` | Generated/hand-written remote module types |
| `packages/mfe-ui` | Shared UI above tokens |

## Auth (v1 — mock)

- No `packages/auth` and no auth remote.
- Shell wraps app in `UserProvider` with `mockUser` from `@repo/mfe-shared`.
- Remotes accept `RemoteSlotProps` (`user` prop only).
- Production pattern (documented, not built): shell validates session once; remotes get read-only user or claims.

## Code layout (conventions)

Documented in [AGENTS.md](./AGENTS.md#code-conventions). Summary:

- **`src/features/<feature-name>/`** — domain UI and logic per app (`components/`, `hooks/`, `lib/`).
- **`app.tsx`** (shell) — router wiring; imports route components from `features/`.
- **kebab-case** file and folder names; **PascalCase** React component names inside those files.

## Routing

- All URLs are shell routes: `/`, `/products`, `/cart`, `/interview`.
- Remotes do not register top-level routes in v1.
- Deep links hit the shell first; shell lazy-imports the remote component for that route.

## Module Federation

- Plugin: `@module-federation/vite`
- Dev remote entries: `http://localhost:5174/remoteEntry.js`, `http://localhost:5175/remoteEntry.js`
- Prod: `VITE_MFE_PRODUCTS_URL`, `VITE_MFE_CART_URL` on shell build
- Shared: `react`, `react-dom` as **singletons** via `federationShared`

## Failure handling

| Failure | Behavior | Location |
|---------|----------|----------|
| Remote down / import fails | “Could not load” fallback | `apps/shell/src/features/shell-core/lib/load-remote.tsx` |
| Remote throws in render | “Unavailable” + retry | `apps/shell/src/features/shell-core/components/remote-error-boundary.tsx` |

## Key files

- Host config: `apps/shell/vite.config.ts`
- Remote configs: `apps/mfe-products/vite.config.ts`, `apps/mfe-cart/vite.config.ts`
- Federation shared: `packages/mfe-shared/src/federation-shared.ts`
- Shell routes: `apps/shell/src/app.tsx`

## Retained platform packages (not in MFE demo v1)

| Package | Purpose |
|---------|---------|
| `@repo/design-system` | Shared UI — integrate via future spec |
| `@repo/neon-auth` | Neon Auth — API session verify + shell client (`@repo/auth` Clerk deprecated) |
| `@repo/database` | Prisma — optional backend for future features |
