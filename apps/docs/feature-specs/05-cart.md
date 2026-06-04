# Feature Spec: Cart (remote)

## Status

**Draft** — approve after **02**; ideally after **04** so product IDs exist for mock cart lines.

## Goal

Evolve the cart remote from static lines to interactive mock cart state: update quantities, remove lines, show subtotal, empty cart state.

## User story

As a shopper, I want to review and edit my cart so I can see how the checkout team owns cart behavior independently from catalog.

## Requirements

- [ ] Cart state held in remote (React state or `features/cart/lib/cart-store.ts` — no global event bus in v1)
- [ ] Increase/decrease quantity per line (min 1 or remove at 0)
- [ ] Remove line button
- [ ] Subtotal recalculates from line prices
- [ ] Empty cart state with message when no lines
- [ ] `CartWidget` accepts `RemoteSlotProps`; show `user.email` or name
- [ ] Federation expose remains `./CartWidget`

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

- [ ] Quantity changes update subtotal
- [ ] Remove line works; empty state when last item removed
- [ ] Shell `/cart` works; failure demo still works if remote stopped
- [ ] `bun run build --filter=mfe-cart` passes

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

Before coding: read `apps/docs/AGENTS.md`, `progress-tracker.md`, this spec.

After coding: update `progress-tracker.md`; stop before T2.
