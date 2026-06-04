# Cart flow — Phase 1: Cross-MFE (shell orchestration)

## Status

**Completed** — phase 1 shipped (T1–T5). Phase 2: [phase-2-persisted-api.md](./phase-2-persisted-api.md) (draft).

## Goal

Demonstrate cross-remote communication the **right way for interviews**: shell-owned cart state, products remote emits “add item,” cart remote renders and mutates via host callbacks — no shared mutable global between remotes and **no** direct remote-to-remote imports.

## User story

As a shopper, I want to add a product from the catalog page and see it reflected in the cart without a full page reload.

## Resolved decisions

| ID | Decision |
|----|----------|
| P1-1 | Cart lines owned by **shell** (`features/cart-session/`), not `mfe-cart` internal `useState` on the host path |
| P1-2 | **Props/callbacks** over custom event bus (bus remains optional interview tangent, not implemented) |
| P1-3 | **`CartLine` in `@repo/mfe-shared`** — `Product` already there from spec **12** |
| P1-4 | Merge duplicate adds by **`productId`** (increment `quantity`) |
| P1-5 | Line `id` equals **`productId`** for v1 (stable, simple dedup) |
| P1-6 | **No** new npm package (`@repo/cart`); **no** Zustand in phase 1 |
| P1-7 | Shell may expose **cart item count** in header (optional T3) |
| P1-8 | Add-to-cart resolves product fields from shell’s catalog list on `/products` |

## Requirements

### Shared contract (`@repo/mfe-shared`)

- [x] Export `CartLine` type (move shape from `mfe-cart` feature types)
- [x] Extend `ProductsRemoteProps` with `onAddToCart: (productId: string) => void`
- [x] Add `CartRemoteProps`: `lines`, `subtotal`, `onUpdateQuantity`, `onRemoveLine` (+ existing `user` from `RemoteSlotProps`)
- [x] Update `apps/shell/src/remotes.d.ts` module declarations for both remotes

### Shell (`apps/shell`)

- [x] `features/cart-session/hooks/use-shell-cart.ts` — lines, subtotal, `addToCart`, `updateQuantity`, `removeLine`
- [x] `buildCartLine` inline in hook — map `Product` → `CartLine`
- [x] `CartSessionProvider` in `app.tsx` so **products** and **cart** routes share one session
- [x] `products-route-page.tsx` — pass `onAddToCart` into `ProductsPage`
- [x] `cart-route-page.tsx` — pass cart props into `CartWidget`
- [x] `shell-layout.tsx` — cart badge count from session (T4)

### Products remote (`apps/mfe-products`)

- [x] `ProductCard` — “Add to cart” button calls `onAddToCart(product.id)` when prop provided
- [x] `ProductsPage` threads `onAddToCart` through to list/cards
- [x] Hidden add control when callback omitted (standalone remote dev)

### Cart remote (`apps/mfe-cart`)

- [x] `CartWidget` — **controlled** mode: render `lines` from props; call host `onUpdateQuantity` / `onRemoveLine`
- [x] `useCart` + `initialCartLines` only in `StandaloneCartApp` for remote dev
- [x] `CartLine` re-exported from `@repo/mfe-shared` in feature `types.ts`

## Out of scope (phase 1)

- Postgres / Prisma cart models
- `apps/api` cart routes
- Optimistic HTTP, refresh persistence
- `@repo/cart` package, Zustand store shared across remotes
- Direct import between `mfe-products` and `mfe-cart`
- Product detail page / `GET /api/products/:id` (not required for list add)

See [phase-2-persisted-api.md](./phase-2-persisted-api.md).

## Architecture impact

| Area | Change |
|------|--------|
| `packages/mfe-shared` | `CartLine`, `CartRemoteProps`, extend `ProductsRemoteProps` |
| `apps/shell` | `cart-session`, wire both routes, optional nav count |
| `apps/mfe-products` | Add button + prop threading |
| `apps/mfe-cart` | Controlled widget; types from shared |

## Proposed types (reference)

```ts
// @repo/mfe-shared
export type CartLine = {
  id: string;           // === productId in v1
  productId: string;
  name: string;
  price: number;        // integer USD, matches Product
  quantity: number;
};

export type ProductsRemoteProps = RemoteSlotProps & {
  products: Product[];
  onAddToCart: (productId: string) => void;
};

export type CartRemoteProps = RemoteSlotProps & {
  lines: CartLine[];
  subtotal: number;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemoveLine: (lineId: string) => void;
};
```

## Flow

```txt
User clicks Add on ProductCard (mfe-products)
  → onAddToCart(productId) (prop from shell)
  → useShellCart.addToCart(productId)
       → find Product in shell products list (or last-known catalog)
       → merge line by productId or append
  → navigate to /cart
  → CartWidget(lines, handlers) (mfe-cart)
```

## Implementation tasks

### T1 — Shared types and remote declarations ✅

**Files:**

- `packages/mfe-shared/src/types.ts`
- `packages/mfe-shared/src/index.ts`
- `apps/shell/src/remotes.d.ts`
- `apps/mfe-cart/src/features/cart/types.ts` — re-exports `CartLine` from shared
- Stub `onAddToCart` / cart props on shell routes and standalone `main.tsx` until **T2**/**T3**

**Verify:**

- [x] `bun run typecheck` in `mfe-shared`, `shell`, `mfe-products`, `mfe-cart`

### T2 — Shell cart session + route wiring ✅

**Files:**

- `apps/shell/src/features/cart-session/hooks/use-shell-cart.ts`
- `apps/shell/src/features/cart-session/components/cart-session-provider.tsx`
- `apps/shell/src/app.tsx` — `CartSessionProvider`
- `apps/shell/src/features/products-route/components/products-route-page.tsx`
- `apps/shell/src/features/cart-route/components/cart-route-page.tsx`

**Verify:**

- [x] Manual: add on `/products`, open `/cart`, line visible with correct name/price/qty
- [x] Duplicate add increments quantity

### T3 — Product add button + controlled cart remote ✅

**Files:**

- `apps/mfe-products/src/features/catalog/components/product-list.tsx`, `products-page.tsx`
- `apps/mfe-cart/src/features/cart/components/cart-widget.tsx`
- `apps/mfe-cart/src/features/cart/components/standalone-cart-app.tsx`

**Verify:**

- [x] `bun run build --filter=shell --filter=mfe-products --filter=mfe-cart` passes

### T4 — Shell header cart count ✅

**Files:**

- `apps/shell/src/features/shell-chrome/components/shell-layout.tsx`

**Verify:**

- [x] Nav shows count = sum of line quantities; updates after add

### T5 — Architecture + interview docs ✅

**Files:**

- [architecture.md](./architecture.md) — diagrams and flows
- `apps/docs/interview-guide.md` — “Cross-MFE cart (shell orchestration)”
- `apps/docs/architecture.md` — link to spec **08** architecture

**Verify:**

- [x] Talking point matches implemented flow

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/08-cart-flow/phase-1-cross-mfe.md`.

Before coding: read `apps/docs/AGENTS.md`, [overview.md](./overview.md), and this file.

After coding: update task checkboxes here and [acceptance-criteria.md](./acceptance-criteria.md); stop before T2 unless the user asks to continue.
