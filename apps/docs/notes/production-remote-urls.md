# Production remote URLs (spec 09)

*How this repo points the shell at remotes in dev, preview, and production.*

Related spec: [09-prod-remote-env.md](../feature-specs/09-prod-remote-env.md) · Host federation: [module-federation-vite-and-shell.md](./module-federation-vite-and-shell.md)

---

## The one-liner

**Remote entry URLs are baked into the shell at build time.** `apps/shell/vite.config.ts` reads `VITE_MFE_PRODUCTS_URL` and `VITE_MFE_CART_URL` (full paths to each remote’s `remoteEntry.js`). Dev defaults are `localhost:5174` and `5175`; staging/prod set these env vars when you build the shell, after remotes are already deployed.

---

## Env vars (shell only)

| Variable | Default (dev) | Points at |
|----------|-----------------|-----------|
| `VITE_MFE_PRODUCTS_URL` | `http://localhost:5174/remoteEntry.js` | `mfe-products` build output |
| `VITE_MFE_CART_URL` | `http://localhost:5175/remoteEntry.js` | `mfe-cart` build output |

Copy `apps/shell/.env.example` for local overrides. These are **Vite** vars — they must be present when you run `vite build` on the shell, not when you run `vite dev` on remotes (unless you rebuild the shell).

Optional future (spec **06** checkout remote): `VITE_MFE_CHECKOUT_URL` → `:5176/remoteEntry.js`.

---

## Deploy order (production)

```txt
1. Build + deploy mfe-products  →  CDN/static host serves remoteEntry.js + hashed chunks
2. Build + deploy mfe-cart      →  same
3. Build shell with VITE_MFE_*_URL set to those live remoteEntry URLs
4. Deploy shell
```

**Why remotes first:** the shell bundle does not include remote UI. At runtime the browser fetches `remoteEntry.js` from the URLs you embedded in step 3. If the shell goes live before remotes, `/products` and `/cart` hit “Could not load” fallbacks.

**Interview line:** “Independent deploy per team, but the host has a compile-time contract on where each remote’s manifest lives.”

---

## Local preview (mirrors prod)

Use this when you want to verify **built** remotes + **built** shell, not `turbo dev`:

```sh
bun run build:remotes
bun run preview:remotes          # :5174 + :5175 — keep running

# another terminal
VITE_MFE_PRODUCTS_URL=http://localhost:5174/remoteEntry.js \
VITE_MFE_CART_URL=http://localhost:5175/remoteEntry.js \
  bun run build --filter=shell

cd apps/shell && bun run preview   # :5173
```

Run **`apps/api`** as well if you need sign-in, catalog, or persisted cart (`VITE_API_BASE_URL`).

Root scripts: `build:remotes`, `preview:remotes`. Turbo `preview` task depends on `build` and is persistent (see `turbo.json`).

---

## Build-time vs runtime (common mistake)

| | When it applies |
|--|------------------|
| **Remote URLs** (`VITE_MFE_*`) | Shell **build** — grep `apps/shell/dist` and you’ll see the URLs inlined |
| **API URL** (`VITE_API_BASE_URL`) | Shell **build** — same |
| **Remote chunks** | Fetched at **runtime** from whatever origin `remoteEntry.js` advertises |

Changing env after the shell is built does nothing until you rebuild the shell.

---

## CDN caching (`remoteEntry.js`)

In production, `remoteEntry.js` is the **federation manifest**: it lists exposed modules and where chunk files live.

- **Long cache on `remoteEntry.js` without versioning** → users can load stale manifests after a remote deploy; chunks 404 or React shared mismatches.
- **Typical pattern:** short TTL or cache-bust on `remoteEntry.js`; long immutable cache on **hashed** chunk assets (`assets/*.js`).
- **Shared deps:** host and remotes agree on `federationShared` (singleton React) — keep major versions aligned across deploys.

Say in interview: “We treat `remoteEntry.js` like a service discovery file, not a static asset you cache forever.”

---

## CI / monorepo matrix (mental model)

Each app is its own Turbo package with its own `dist/`:

| Job | Filter | Output |
|-----|--------|--------|
| Build products remote | `mfe-products` | `remoteEntry.js` + chunks |
| Build cart remote | `mfe-cart` | same |
| Build shell | `shell` | host bundle; needs `VITE_MFE_*` env in that job |

You do **not** need to rebuild remotes when only the shell changes routing — unless shared contracts change. You **do** need to rebuild the shell when remote **URLs** change (new CDN hostname, versioned path, etc.).

---

## Key files

| File | Role |
|------|------|
| `apps/shell/vite.config.ts` | Reads `VITE_MFE_*`, registers remotes |
| `apps/shell/.env.example` | Documented env names |
| `apps/mfe-products/vite.config.ts` | `filename: "remoteEntry.js"`, port 5174 |
| `apps/mfe-cart/vite.config.ts` | same, port 5175 |
| Root `README.md` | Step-by-step preview workflow |
| `apps/docs/architecture.md` | Deploy order diagram |

---

## Out of scope (v1)

- Vercel/AWS deploy configs per app
- Runtime manifest / version negotiation (future)
- Checkout remote env until spec **06** ships
