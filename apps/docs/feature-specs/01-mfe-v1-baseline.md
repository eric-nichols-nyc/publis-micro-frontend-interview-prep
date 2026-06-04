# Feature Spec: MFE v1 baseline

## Goal

Document the **already implemented** Vite Module Federation interview demo (host + two remotes + shared package). Serves as the baseline for future specs.

## Status

**Completed** — matches the repo as of initial scaffold.

## User story

As an interview candidate, I want a runnable micro-frontend shop so I can demonstrate routing, federation, shared React, mock auth, and failure handling.

## Requirements (done)

- [x] Shell app on port 5173 with React Router (`/`, `/products`, `/cart`, `/interview`)
- [x] Products remote on 5174 exposing `ProductsPage`
- [x] Cart remote on 5175 exposing `CartWidget`
- [x] `@repo/mfe-shared` — types, tokens, mock user, `federationShared`
- [x] Federation singletons for `react` / `react-dom`
- [x] Shell passes `user` to remotes via `RemoteSlotProps`
- [x] `loadRemote` import fallback + `RemoteErrorBoundary`
- [x] `bun run dev` / `bun run build` filtered to MFE apps

## Out of scope (v1)

- Real auth package or Clerk integration
- SSR
- E2E tests
- Legacy next-forge removal

## File map

```txt
apps/shell/
  vite.config.ts          # remotes: mfe_products, mfe_cart
  src/app.tsx             # routes
  src/context/user-context.tsx
  src/lib/load-remote.tsx
  src/components/remote-error-boundary.tsx
  src/pages/products-page.tsx
  src/pages/cart-page.tsx
apps/mfe-products/
  vite.config.ts          # exposes ./ProductsPage
  src/ProductsPage.tsx
apps/mfe-cart/
  vite.config.ts          # exposes ./CartWidget
  src/CartWidget.tsx
packages/mfe-shared/
  src/types.ts
  src/mock-user.ts
  src/tokens.css
  src/federation-shared.ts
```

## Acceptance criteria (verified)

- [x] `bun run dev` — shell loads remotes on `/products` and `/cart`
- [x] Stopping cart remote — `/cart` fallback, nav works
- [x] `bun run build` — three apps produce `dist/`

## Future tasks (not in this spec)

Use **new** feature specs for: legacy cleanup, `apps/docs`-only planning PRs, real auth, E2E, prod env docs.
