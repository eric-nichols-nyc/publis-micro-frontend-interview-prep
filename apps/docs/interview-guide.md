# Micro-frontends interview guide

Runnable demo + talking points. Code lives in `apps/shell`, `apps/mfe-*`, `packages/mfe-shared`.

## Quick start

```sh
bun install
bun run dev
```

Open http://localhost:5173 — try `/products`, `/cart`. **Failure demo:** stop `mfe-cart`, visit `/cart`.

## Core interview answers

### What are micro-frontends, and why use them?

Split the frontend by **business domain** so teams can develop, deploy, and scale independently. Tradeoff: operational complexity, shared dependency governance, integration testing.

### Routing

- **This repo:** shell owns React Router; remotes render into route slots.
- **Deep links:** `/products`, `/cart` are shell URLs.
- **SSR (prod):** shell resolves route server-side — not implemented here.

### Sharing libraries

- **Runtime:** Module Federation `shared` with `singleton` for `react` / `react-dom`.
- **Build-time:** `@repo/mfe-shared` for types and tokens.
- **Design system:** `tokens.css` today; full UI library optional later.

### Auth

- **This repo:** Neon Auth in shell; profile from `GET /api/me`; `user` prop on remotes (spec **07**).
- **Say in interview:** real auth stays in the shell; remotes don’t embed login.

### Cross-MFE cart (shell orchestration)

- **This repo:** shell `CartSessionProvider` owns cart lines; products remote calls `onAddToCart`; cart remote renders props only.
- **Say in interview:** the host integrates teams — no shared Zustand package across remotes, no `mfe-products` → `mfe-cart` imports.
- **Diagrams:** [feature-specs/08-cart-flow/architecture.md](./feature-specs/08-cart-flow/architecture.md)

### Performance

- Lazy route → lazy remote import; small `exposes`; CDN `remoteEntry.js` in prod.

### When a remote fails

- Import catch + `RemoteErrorBoundary`; shell nav survives.

### Challenges

- Cross-team contracts, React version skew, CI matrix, platform tooling.

## Practice questions → repo

| Question | Where |
|----------|--------|
| When not to use MFEs? | PRD non-goals; domain split must justify cost |
| Share auth / state? | Shell provider + `RemoteSlotProps`; cart via `cart-session` + callbacks (spec **08**) |
| Routing / deep links? | `apps/shell/src/app.tsx` |
| Duplicate React? | `federation-shared.ts` |
| Independent deploy? | Per-app `dist/`, env remote URLs on shell |
| Real-world use case? | E-commerce: catalog + cart teams |

## Key files

See [architecture.md](./architecture.md).

## Repo packages

MFE runtime uses `@repo/mfe-shared` only. `design-system`, `auth`, and `database` are kept for future integration — not required for the baseline demo.
