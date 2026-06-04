# Feature Spec: Products catalog (remote)

## Status

**Draft** — approve after **02** (feature folders in place).

## Goal

Make the products remote feel like a real catalog domain: search, list states, and optional product detail — still client-side mock data.

## User story

As a shopper, I want to browse and search products so I can find items before adding them to cart (cart integration is a later spec).

## Requirements

- [ ] Product list with at least 6 mock items in `features/catalog/lib/mock-products.ts`
- [ ] Search/filter by name (client-side)
- [ ] Empty state when filter matches nothing
- [ ] Loading skeleton or brief simulated loading state on first mount (optional but recommended for interview)
- [ ] `ProductsPage` still accepts `RemoteSlotProps` (`user` displayed)
- [ ] Federation expose remains `./ProductsPage` (via root re-export)

## Out of scope

- Server API / `@repo/database`
- Add-to-cart (see **05-cart**)
- Product images CDN (placeholder or text-only OK)
- New routes inside remote (shell owns URLs)

## Architecture impact

- Apps: `mfe-products` only
- Packages: optional shared `Product` type in `@repo/mfe-shared` if shell/cart need it later
- New package: no

## Proposed file structure

```txt
apps/mfe-products/src/features/catalog/
  components/
    products-page.tsx
    product-list.tsx
    product-search.tsx
    catalog-empty-state.tsx
  hooks/
    use-product-search.ts
  lib/
    mock-products.ts
  types.ts
```

## Acceptance criteria

- [ ] Search filters visible products
- [ ] Empty filter shows empty state
- [ ] Shell `/products` shows updated UI
- [ ] `bun run build --filter=mfe-products` passes

## Implementation tasks

### T1 — Mock data and types

Files:

- `features/catalog/lib/mock-products.ts`
- `features/catalog/types.ts`

Verify:

- Types export; mock array has 6+ items

### T2 — Search hook + list UI

Files:

- `features/catalog/hooks/use-product-search.ts`
- `features/catalog/components/product-search.tsx`
- `features/catalog/components/product-list.tsx`

Verify:

- Standalone remote filters list when typing

### T3 — Compose products-page + empty/loading

Files:

- `features/catalog/components/products-page.tsx`
- `features/catalog/components/catalog-empty-state.tsx`
- Root re-export unchanged for federation

Verify:

- Shell `/products` full flow; user name still shown

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/04-products-catalog.md`.

Before coding: read `apps/docs/AGENTS.md`, `progress-tracker.md`, this spec.

After coding: update `progress-tracker.md`; stop before T2.
