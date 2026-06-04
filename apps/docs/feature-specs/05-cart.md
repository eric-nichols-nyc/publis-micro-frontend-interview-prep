# Feature Spec: Cart (remote)

## Status

**Completed** — T1–T3 implemented in `mfe-cart`.

## Goal

Evolve the cart remote from static lines to interactive mock cart state: update quantities, remove lines, show subtotal, empty cart state.

## User story

As a shopper, I want to review and edit my cart so I can see how the checkout team owns cart behavior independently from catalog.

## Requirements

- [x] Cart state held in remote (React state or `features/cart/lib/cart-store.ts` — no global event bus in v1)
- [x] Increase/decrease quantity per line (min 1 or remove at 0)
- [x] Remove line button
- [x] Subtotal recalculates from line prices
- [x] Empty cart state with message when no lines
- [x] `CartWidget` accepts `RemoteSlotProps`; show `user.email` or name
- [x] Federation expose remains `./CartWidget`

## Out of scope

- Cross-remote “add to cart” from products page (mention in interview as shell event bus / shared store — future spec)
- Real payments
- Persistence (localStorage optional — not required)
- `@repo/database`

## Architecture impact

- Apps: `mfe-cart` only
- Packages: optional `CartLine` type in `mfe-shared` if products spec adds `Product` type
- New package: no

## Proposed file structure

```txt
apps/mfe-cart/src/features/cart/
  components/
    cart-widget.tsx
    cart-line-list.tsx
    cart-line-item.tsx
    cart-summary.tsx
    cart-empty-state.tsx
  hooks/
    use-cart.ts
  lib/
    initial-cart-lines.ts
  types.ts
```

## Acceptance criteria

- [x] Quantity changes update subtotal
- [x] Remove line works; empty state when last item removed
- [x] Shell `/cart` works; failure demo still works if remote stopped
- [x] `bun run build --filter=mfe-cart` passes

## Implementation tasks

### T1 — Types and initial lines

Files:

- `features/cart/types.ts`
- `features/cart/lib/initial-cart-lines.ts`

Verify:

- Initial cart has 2+ lines with price fields

### T2 — use-cart hook

Files:

- `features/cart/hooks/use-cart.ts`

Verify:

- Hook supports update qty, remove, computed subtotal

### T3 — UI components + cart-widget compose

Files:

- `cart-line-item.tsx`, `cart-line-list.tsx`, `cart-summary.tsx`, `cart-empty-state.tsx`
- `cart-widget.tsx` + root re-export

Verify:

- Interactive cart on `/cart` in shell

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/05-cart.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update this spec and `00-index.md` if needed; stop before T2 unless the user asks to continue.
