# Module Federation (`@module-federation/vite`) and the shell

*Interview-style explanation of how this repo wires Module Federation.*

---

## The one-liner I’d open with

“We use **Vite** for all three frontends, and **`@module-federation/vite`** as the federation plugin. The **shell is the host** — it owns routing, layout, and session. **Products and cart are remotes** — they build their own `remoteEntry.js`, expose React components, and the shell loads those modules at runtime instead of bundling them into the host chunk.”

That’s the mental model: **one deployable shell app** that composes **independently built** UI from other origins.

---

## Why Module Federation here (not a monolith import)

In an interview I’d frame the tradeoff first:

- **Team boundaries** — catalog and cart can ship on their own cadence; the shell team doesn’t need to redeploy when cart changes a line item.
- **Runtime composition** — the shell doesn’t `import` remote source at build time from another package in the monorepo; it resolves **`mfe_products/ProductsPage`** and **`mfe_cart/CartWidget`** through federation’s remote manifest.
- **Shared React** — we declare `react` and `react-dom` as **singletons** so we don’t mount two Reacts (that’s the classic MF footgun).

What we’re *not* doing in v1: remotes registering their own top-level routes. **All URLs are shell routes** (`/products`, `/cart`). The remote only renders the slot the shell gives it.

---

## What `@module-federation/vite` actually does

It’s the **Module Federation plugin for Vite** — same conceptual model as Webpack Module Federation, adapted to Vite’s dev server and ESM output.

On each app it hooks into the Vite pipeline and:

1. **Host (shell)** — registers **remotes** (name + entry URL to `remoteEntry.js`) and **shared** dependencies.
2. **Remote (mfe-products, mfe-cart)** — sets **`filename: "remoteEntry.js"`**, **exposes** named modules, and the same **shared** config.

In dev, each app is still its own Vite server (`5173`, `5174`, `5175`). Federation makes the host’s `import("mfe_products/ProductsPage")` resolve to a **runtime fetch** of the remote’s entry and exposed module, not a static workspace import.

---

## Host config — shell as consumer

The shell plugin block is in `apps/shell/vite.config.ts`:

```ts
federation({
  name: "shell",
  remotes: {
    mfe_products: {
      type: "module",
      entry: productsRemoteEntry, // dev default: http://localhost:5174/remoteEntry.js
      // ...
    },
    mfe_cart: { /* 5175 */ },
  },
  shared: federationShared,
})
```

Points I’d call out in an interview:

- **`name: "shell"`** — identity of this container in the federation graph.
- **`remotes`** — map of remote **container names** to **entry URLs**. Dev defaults hit localhost; production uses `VITE_MFE_PRODUCTS_URL` and `VITE_MFE_CART_URL` (see spec `09-prod-remote-env.md`).
- **`type: "module"`** — ESM-style remote loading (fits Vite’s native output).
- **`shared: federationShared`** — from `@repo/mfe-shared`; keeps one React instance across host + remotes.

The shell does **not** `exposes` anything — it only consumes.

---

## Remote config — what each MFE publishes

Example: `apps/mfe-products/vite.config.ts`:

```ts
federation({
  name: "mfe_products",
  filename: "remoteEntry.js",
  exposes: {
    "./ProductsPage": "./src/products-page.tsx",
  },
  shared: federationShared,
})
```

Cart is the same pattern with `name: "mfe_cart"` and `./CartWidget`.

Interview vocabulary:

- **`name`** — must match the key the host uses in `remotes` (`mfe_products`, `mfe_cart`).
- **`filename: "remoteEntry.js"`** — the bootstrap file the host loads first; it advertises what this remote can serve.
- **`exposes`** — public paths the host imports as `mfe_products/ProductsPage` (remote name + expose key).

Each remote still runs standalone on its port for local dev; federation is what lets the shell pull its UI in.

---

## Shared dependencies — why `federationShared` exists

```ts
// packages/mfe-shared/src/federation-shared.ts
react: { singleton: true, requiredVersion: "^19.2.0" },
"react-dom": { singleton: true, requiredVersion: "^19.2.0" },
```

I’d say: “Host and remotes both list the same shared config so the federation runtime negotiates a **single** React. Without `singleton: true`, you can get subtle bugs — hooks breaking, context not crossing boundaries, duplicate roots.”

We centralize that in **`@repo/mfe-shared`** so all three Vite configs stay aligned.

---

## Runtime flow in the shell (what happens on `/products`)

1. User hits **`/products`** — React Router in the shell (`apps/shell/src/app.tsx`).
2. **`ProductsRoutePage`** wraps the remote in `Suspense` + `RemoteErrorBoundary`.
3. **`loadRemote`** wraps a dynamic import:

   ```ts
   loadRemote(() => import("mfe_products/ProductsPage"), "Products")
   ```

4. That `import()` is federation-aware: Vite/the plugin rewrite it to load **`remoteEntry.js`** from `5174` (or prod URL), then the exposed `./ProductsPage` module.
5. Shell passes **`user`** via `RemoteSlotProps` from context (`UserProvider` + `useUser()`).

So routing and auth chrome stay in the shell; the remote is a **component slot** with a typed contract (`user` prop in v1).

**Failure modes we planned for:**

- Import fails (remote down) → `loadRemote` catches and shows `RemoteLoadFallback`.
- Remote throws while rendering → `RemoteErrorBoundary` with retry.

---

## TypeScript — how the host “knows” remote modules

Federation imports look like bare specifiers: `mfe_products/ProductsPage`. TypeScript doesn’t understand those without declarations.

We use:

- **`apps/shell/src/remotes.d.ts`** — hand-written `declare module` for each expose, typed as `ComponentType<RemoteSlotProps>`.
- **`apps/shell/@mf-types/`** — generated federation API types (when DTS generation is enabled; we currently set `dts: false` in vite configs and maintain `remotes.d.ts` for the interview baseline).

In an interview: “The runtime contract is federation; the **compile-time contract** is our shared `RemoteSlotProps` plus module declarations.”

---

## Local dev — what I run and what order matters

From the repo root:

```sh
bun run dev
```

That runs Turbo with **shell + both remotes** (`5173`, `5174`, `5175`). All three need to be up for federation imports to succeed; otherwise the shell still renders but you’ll see the “Could not load” fallback.

I’d mention **strict ports** and **`origin`** on each Vite server — federation dev URLs are explicit (`http://localhost:5174/remoteEntry.js`) so asset URLs stay consistent.

---

## Production angle (brief, for “how would you deploy?”)

- Build and deploy **remotes first** (each serves its own `remoteEntry.js` + chunks on a CDN or static host).
- Build the **shell** with env vars pointing at those entry URLs.
- Cache strategy matters for `remoteEntry.js` — it’s the manifest; teams often version remotes or use compatible shared dependency ranges.

We document env names in architecture and feature spec **09**; the vite config already reads `VITE_MFE_*_URL` with localhost fallbacks.

---

## Diagram I’d draw on a whiteboard

```txt
Browser @ localhost:5173 (shell)
    │
    │  React Router: /products
    ▼
import("mfe_products/ProductsPage")  ← federation runtime
    │
    │  fetch remoteEntry.js @ :5174
    ▼
mfe-products exposes ProductsPage
    │
    └── shared react/react-dom (singleton) ← negotiated with host
```

---

## Closing line for the interviewer

“**`@module-federation/vite`** gives us independent Vite apps that still compose in the browser: the shell is the integration point for navigation and session, remotes expose route-sized components, and **shared singletons** keep one React tree. The interesting engineering is less the plugin API and more **contracts** (`RemoteSlotProps`), **failure handling**, and **deploy URLs** for `remoteEntry.js`.”

---

## Pointers in this repo

| Topic | Location |
|--------|----------|
| Host federation config | `apps/shell/vite.config.ts` |
| Remote configs | `apps/mfe-products/vite.config.ts`, `apps/mfe-cart/vite.config.ts` |
| Shared MF deps | `packages/mfe-shared/src/federation-shared.ts` |
| Lazy remote load | `apps/shell/src/features/shell-core/lib/load-remote.tsx` |
| Route consumption | `apps/shell/src/features/products-route/`, `cart-route/` |
| Architecture overview | `apps/docs/architecture.md` |
