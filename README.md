# Micro-frontend interview prep

A **Turborepo** workspace for practicing micro-frontend interviews: Vite Module Federation with a shell host and two domain remotes (products, cart).

## Apps

| App | Port | Role |
|-----|------|------|
| `shell` | 5173 | Host — routing, nav, session via API, error boundaries |
| `mfe-products` | 5174 | Remote — `ProductsPage` |
| `mfe-cart` | 5175 | Remote — `CartWidget` |
| `api` | 3001 | Express — health, `/api/me`, user routes (`@repo/neon-auth`, `@repo/database`) |

## Packages

| Package | Role |
|---------|------|
| `@repo/mfe-shared` | Types, tokens, mock user, federation shared config (used by MFE apps) |
| `@repo/typescript-config` | Shared TypeScript configs |
| `@repo/design-system` | shadcn/ui components (retained for future shell UI) |
| `@repo/neon-auth` | Neon Auth client (shell) + server session verify (API) |
| `@repo/neon-auth` | Neon Auth (API + shell); `@repo/auth` Clerk deprecated |
| `@repo/database` | Prisma + Neon Postgres |

## Getting started

**Prerequisites:** Node.js 20+, [Bun](https://bun.sh)

```sh
bun install
bun run dev
```

Open **http://localhost:5173**

### Auth E2E (sign-up · sign-in · sign-out)

Required before other MFE work. Configure Neon on shell + API (`DEV_AUTH_*` off). Follow the checklist in [apps/docs/feature-specs/07-auth-e2e-gate.md](apps/docs/feature-specs/07-auth-e2e-gate.md).

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Shell + remotes + API |
| `bun run dev:api` | API only |
| `bun run build` | Build all workspace packages with a `build` script |
| `bun run build:remotes` | Build `mfe-products` + `mfe-cart` only |
| `bun run preview:remotes` | Preview built remotes on :5174 / :5175 |
| `bun run test:e2e:install` | Install Playwright Chromium (first time) |
| `bun run test:e2e` | Playwright smoke — shell + remotes + API (starts `bun run dev` unless already running) |
| `bun run typecheck` | Typecheck across workspace |
| `bun run check` / `fix` | Lint and format |
| `bun run migrate` | Prisma migrate (`packages/database`) |
| `bun run bump-ui` | Add shadcn components to design-system |

### Failure demo

Stop only `mfe-cart`, visit http://localhost:5173/cart — fallback UI; shell nav still works.

### Production remote URLs

The shell loads remotes at **build time** via `VITE_MFE_PRODUCTS_URL` and `VITE_MFE_CART_URL` (see `apps/shell/.env.example`). Each value must be the full URL to that remote’s `remoteEntry.js`.

| Variable | Dev default | App |
|----------|-------------|-----|
| `VITE_MFE_PRODUCTS_URL` | `http://localhost:5174/remoteEntry.js` | `mfe-products` |
| `VITE_MFE_CART_URL` | `http://localhost:5175/remoteEntry.js` | `mfe-cart` |
| `VITE_API_BASE_URL` | `http://localhost:3001` | `api` |

**Deploy order:** build and deploy **remotes first** (each serves `remoteEntry.js` + chunks), then build the **shell** with env vars pointing at those URLs. In production, cache `remoteEntry.js` carefully — it is the federation manifest (see [interview guide](apps/docs/interview-guide.md)).

**Local preview (production-like federation):**

```sh
# 1. Build remotes
bun run build:remotes

# 2. Serve built remotes (keep running; ports 5174 + 5175)
bun run preview:remotes

# 3. In another terminal — build shell against preview URLs
VITE_MFE_PRODUCTS_URL=http://localhost:5174/remoteEntry.js \
VITE_MFE_CART_URL=http://localhost:5175/remoteEntry.js \
VITE_API_BASE_URL=http://localhost:3001 \
  bun run build --filter=shell

# 4. Preview shell (API should be running for auth/catalog/cart)
cd apps/shell && bun run preview
```

Open **http://localhost:5173** and exercise `/products` and `/cart`.

### E2E smoke tests

Playwright lives in `apps/shell/e2e/`. The runner starts **`bun run dev`** (shell, both remotes, API) unless something is already listening on `:5173`.

**Prerequisites:** `packages/database/.env` with `DATABASE_URL` (sign-up hits the API). First run: `bun run test:e2e:install`.

```sh
bun run test:e2e
```

Tests cover home, federated `/products` and `/cart` (`data-remote` markers), and main nav. To prove integration: stop `mfe-cart` and re-run — `/cart` should fail.

**CI:** [.github/workflows/e2e-mfe.yml](.github/workflows/e2e-mfe.yml) — set repo secret `DATABASE_URL` (Neon connection string).

## Documentation

All planning docs: **[apps/docs/](apps/docs/)**

- [PRD](apps/docs/PRD.md) · [Architecture](apps/docs/architecture.md) · [Feature specs](apps/docs/feature-specs/00-index.md) · [Interview guide](apps/docs/interview-guide.md)

Agents: [AGENTS.md](AGENTS.md) → [apps/docs/AGENTS.md](apps/docs/AGENTS.md)

## Structure

```txt
apps/
  shell/
  mfe-products/
  mfe-cart/
  docs/                 # PRD, specs, interview guide (markdown)
packages/
  mfe-shared/
  typescript-config/
  design-system/
  auth/
  database/
```

## License

MIT
