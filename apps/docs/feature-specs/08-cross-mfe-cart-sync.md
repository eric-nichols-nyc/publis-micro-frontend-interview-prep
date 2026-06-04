# Feature Spec: Cross-MFE add to cart (shell orchestration)

## Status

**Draft** — approve after **04** and **05**; advanced interview topic.

## Goal

Demonstrate cross-remote communication the **right way for interviews**: shell-owned cart state (or event bus), products remote emits “add item,” cart remote receives props — no shared mutable global between teams without a contract.

## User story

As a shopper, I want to add a product from the catalog page and see it reflected in the cart without full page reload.

## Requirements

- [ ] Cart line items state owned by **shell** (`features/cart-session/` or similar) OR documented custom event bus with typed events
- [ ] Shell passes `onAddToCart(productId)` (or cart snapshot) into `ProductsPage` via extended props — update `RemoteSlotProps` or `ProductsRemoteProps` in `mfe-shared`
- [ ] `CartWidget` receives cart lines + handlers from shell (read-only mutations callbacks from host)
- [ ] Types for `Product`, `CartLine` in `@repo/mfe-shared`
- [ ] No direct import between remotes

## Out of scope

- Database persistence
- Optimistic API calls
- Redux/Zustand shared npm package unless spec’d as `mfe-shared` only

## Architecture impact

- Apps: `shell`, `mfe-products`, `mfe-cart`
- Packages: `@repo/mfe-shared` (types + optional event type constants)
- New package: no

## Proposed file structure

```txt
packages/mfe-shared/src/
  product-types.ts
  cart-types.ts
  remote-props.ts              # extend props types

apps/shell/src/features/cart-session/
  hooks/
    use-shell-cart.ts
  lib/
    cart-state.ts

apps/mfe-products/...          # add button calls onAddToCart
apps/mfe-cart/...              # display props cart lines
```

## Acceptance criteria

- [ ] Add from products updates cart on `/cart` without restarting remotes
- [ ] Interview doc updated: “shell orchestrates cross-MFE state”
- [ ] Builds pass for all three apps

## Implementation tasks

### T1 — Shared types and props

Files:

- `packages/mfe-shared/src/remote-props.ts` (or extend `types.ts`)

Verify:

- Typecheck passes in all apps

### T2 — Shell cart session state

Files:

- `features/cart-session/` in shell
- Wire props into lazy remote components on products + cart routes

Verify:

- Manual test: add item on `/products`, navigate to `/cart`, item appears

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/08-cross-mfe-cart-sync.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update this spec and `00-index.md` if needed; stop before T2 unless the user asks to continue.
