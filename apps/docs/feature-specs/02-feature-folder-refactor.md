# Feature Spec: Feature folder refactor

## Status

**Completed** — T1–T4 implemented.

## Goal

Align shell and remotes with documented conventions: `src/features/<feature-name>/`, kebab-case file names, thin route/expose entrypoints.

## User story

As a maintainer, I want a consistent folder layout so new domain features are easy to add and interview explanations match the repo structure.

## Requirements

- [x] Shell code reorganized under `src/features/` with kebab-case files
- [x] `mfe-products` catalog UI under `src/features/catalog/`
- [x] `mfe-cart` cart UI under `src/features/cart/`
- [x] Federation `exposes` unchanged (same module paths: `ProductsPage`, `CartWidget`)
- [x] Thin re-export files at `src/products-page.tsx` and `src/cart-widget.tsx` if needed for exposes
- [x] Shared shell utilities (`load-remote`, error boundary) under `src/features/shell-core/` or `src/lib/` only if used by multiple features

## Out of scope

- New product behavior (search, cart mutations)
- Design system integration
- Renaming federation remote names (`mfe_products`, etc.)

## Architecture impact

- Apps: `shell`, `mfe-products`, `mfe-cart`
- Packages: none (optional touch `mfe-shared` only if imports break)
- New package: no

## Proposed file structure

```txt
apps/shell/src/
  features/
    shell-chrome/
      components/
        shell-layout.tsx
    shell-core/
      components/
        remote-error-boundary.tsx
        remote-fallback.tsx
      lib/
        load-remote.tsx
    home/
      components/
        home-page.tsx
    products-route/
      components/
        products-route-page.tsx
    cart-route/
      components/
        cart-route-page.tsx
    interview/
      components/
        interview-page.tsx
  context/
    user-context.tsx
  pages/                    # optional: delete if routes import features directly
  app.tsx
  main.tsx

apps/mfe-products/src/
  features/catalog/
    components/
      products-page.tsx
  products-page.tsx           # export { ProductsPage } from feature

apps/mfe-cart/src/
  features/cart/
    components/
      cart-widget.tsx
  cart-widget.tsx             # export { CartWidget } from feature
```

## Acceptance criteria

- [x] `bun run dev` — all routes work unchanged
- [x] `bun run build` passes for shell, mfe-products, mfe-cart
- [x] `typecheck` passes for all three apps
- [x] No PascalCase **filenames** in `src/` (except generated `@mf-types`)

## Implementation tasks

### T1 — Shell: shell-core + shell-chrome

Files:

- Move `remote-error-boundary`, `remote-fallback`, `load-remote` into `features/shell-core/`
- Move `shell-layout` into `features/shell-chrome/`
- Update imports in `app.tsx` and route pages

Verify:

- Shell starts; nav and layout render on `/`

### T2 — Shell: route features + interview/home

Files:

- Move `home-page`, `products-page`, `cart-page`, `interview-page` into feature folders (kebab-case names)
- Keep `app.tsx` routes pointing at feature exports

Verify:

- `/`, `/products`, `/cart`, `/interview` behave as before

### T3 — mfe-products catalog feature

Files:

- `features/catalog/components/products-page.tsx`
- Root `products-page.tsx` re-export for federation expose
- Update `vite.config.ts` expose path if path changes from `./ProductsPage`

Verify:

- Standalone remote dev and shell `/products` load catalog

### T4 — mfe-cart feature

Files:

- Same pattern as T3 for cart

Verify:

- Shell `/cart` and standalone cart remote work

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/02-feature-folder-refactor.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update this spec and `00-index.md` if needed; stop before T2 unless the user asks to continue.
