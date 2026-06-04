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

## Auth (shell + API)

- **Identity:** Neon Auth (browser SDK in shell). **Trust:** `apps/api` verifies every `GET /api/me` via `@repo/neon-auth` server helpers.
- **Shell:** `ApiUserProvider` hydrates `UserProvider` from `/api/me` (`credentials: 'include'`). Sign-in / sign-out UI is spec **07** (T2).
- **Remotes:** props-only `RemoteSlotProps.user` — no API, no Neon SDK, no `@repo/auth` (Clerk deprecated).
- **Local demo:** API `DEV_AUTH_*` auto-authenticates without Neon UI; shell can omit `VITE_NEON_AUTH_URL`.
- **Production-shaped:** shell `VITE_NEON_AUTH_URL` + API `NEON_AUTH_BASE_URL` + `CORS_ORIGIN` aligned to the same Neon Auth app.

```txt
sign-in (shell) → Neon Auth cookie → GET /api/me (api) → UserProvider → remotes
```

Detail: [feature-specs/07-shell-auth.md](./feature-specs/07-shell-auth.md), [feature-specs/02-api-application/auth-strategy.md](./feature-specs/02-api-application/auth-strategy.md).

## Code layout (conventions)

Documented in [AGENTS.md](./AGENTS.md#code-conventions). Summary:

- **`src/features/<feature-name>/`** — domain UI and logic per app (`components/`, `hooks/`, `lib/`).
- **`app.tsx`** (shell) — router wiring; imports route components from `features/`.
- **kebab-case** file and folder names; **PascalCase** React component names inside those files.

## Routing

- All URLs are shell routes: `/`, `/products`, `/cart`, `/interview`, `/sign-in`, `/sign-up` (auth UX — spec **07**; E2E gate: [07-auth-e2e-gate.md](./feature-specs/07-auth-e2e-gate.md)).
- Remotes do not register top-level routes in v1.
- Deep links hit the shell first; shell lazy-imports the remote component for that route.

## Module Federation

- Plugin: `@module-federation/vite`
- Dev remote entries: `http://localhost:5174/remoteEntry.js`, `http://localhost:5175/remoteEntry.js`
- Prod / staging: set `VITE_MFE_PRODUCTS_URL`, `VITE_MFE_CART_URL` when **building** the shell (`apps/shell/.env.example`)
- Shared: `react`, `react-dom` as **singletons** via `federationShared`

### Deploy order (production)

```txt
1. Build + deploy mfe-products  →  CDN serves …/remoteEntry.js + chunks
2. Build + deploy mfe-cart     →  CDN serves …/remoteEntry.js + chunks
3. Build shell with VITE_MFE_*_URL pointing at those remoteEntry URLs
4. Deploy shell (host)
```

The shell does not bundle remote UI; it fetches `remoteEntry.js` at runtime from the URLs baked in at step 3. Deploy remotes before the shell so entry URLs exist when the host goes live.

Local mirror of this flow: [README.md](../../README.md) — “Production remote URLs”. Spec: [feature-specs/09-prod-remote-env.md](./feature-specs/09-prod-remote-env.md).

## Cross-MFE cart (spec **08**)

Product and cart remotes do not import each other. The shell owns in-memory cart state (`cart-session`) and passes callbacks into `mfe-products` and cart lines into `mfe-cart`.

Full diagrams and sequence flows: [feature-specs/08-cart-flow/architecture.md](./feature-specs/08-cart-flow/architecture.md).

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
- Shell auth: `apps/shell/src/features/auth/`
- Shell cart session: `apps/shell/src/features/cart-session/`
- API session: `apps/api` + `packages/neon-auth`

## Retained platform packages (not in MFE demo v1)

| Package | Purpose |
|---------|---------|
| `@repo/design-system` | Shared UI — integrate via future spec |
| `@repo/neon-auth` | Neon Auth — API session verify + shell client (`@repo/auth` Clerk deprecated) |
| `@repo/database` | Prisma — optional backend for future features |
