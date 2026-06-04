# MFE documentation — agent guide

Operating manual for agents working on the **micro-frontend interview** repo.

## Workflow modes

### Planning (default)

- Do **not** write or edit application code unless the user explicitly asks to implement.
- You **may** create or update: `PRD.md`, `architecture.md`, `feature-specs/`, `interview-guide.md`, root `AGENTS.md`, `README.md`.
- Record unresolved decisions in the relevant feature spec or `00-index.md` notes when needed.

### Implementation

- Requires an **approved** feature spec and explicit user request (e.g. “implement T1 from `01-mfe-v1-baseline.md`”).
- Implement **one spec task at a time**; update the spec and `00-index.md` when status changes.
- Do not invent requirements outside the spec.

## Read order (before any work)

1. `PRD.md`
2. `architecture.md`
3. `feature-specs/00-index.md`
4. Relevant feature spec
5. `interview-guide.md` (for interview narrative only)

## In-scope code paths

- `apps/shell`
- `apps/mfe-products`
- `apps/mfe-cart`
- `packages/mfe-shared`
- `packages/typescript-config`
- `packages/design-system`, `packages/auth`, `packages/database` (optional integrations — not wired into MFE demo by default)

## Stack (MFE)

- Vite 7, React 19, TypeScript
- `@module-federation/vite` — host + remotes
- React Router — **shell only**
- Shared workspace package: `@repo/mfe-shared`

## Auth (v1)

- **No** dedicated `packages/auth` folder.
- Mock user in `@repo/mfe-shared`; `UserProvider` in shell; remotes receive `user` via `RemoteSlotProps`.
- Real auth (deferred): implement in `apps/shell` first; add `packages/mfe-auth` only if shared helpers are duplicated.

## Validation

```sh
# From repo root
bun run dev          # shell + remotes
bun run build        # production build for MFE apps

# Per app
cd apps/shell && bun run typecheck
cd apps/mfe-products && bun run typecheck
cd apps/mfe-cart && bun run typecheck
```

## Spec-driven workflow

1. Create or update a feature spec under `feature-specs/`.
2. Register it in `feature-specs/00-index.md`.
3. Implement one task at a time (implementation mode only).
4. Verify; update spec status and `00-index.md` when done.

## Code conventions

### Feature folder pattern

Put feature code under `src/features/<feature-name>/` in each app (`shell`, `mfe-products`, `mfe-cart`). Do not dump domain logic in generic `src/components/` or loose `src/lib/` unless it is truly shared across features.

```txt
apps/shell/src/
  features/
    shell-chrome/          # layout, nav (optional grouping)
      components/
    products-route/
      components/
    cart-route/
      components/
  pages/                   # thin route entries — import from features/
  app.tsx                  # router wiring
```

```txt
apps/mfe-products/src/
  features/
    catalog/
      components/
        products-page.tsx
  ProductsPage.tsx           # federation expose — re-export from feature (until migrated)
```

Per feature, use only what you need:

```txt
features/<feature-name>/
  components/              # UI (kebab-case filenames)
  hooks/                   # use-* hooks
  lib/                     # feature-local helpers
  types.ts                 # feature-local types
```

- **Shell:** owns routing, layout, auth context, and federation loading in `pages/` or `app.tsx`; feature folders hold UI and feature logic.
- **Remotes:** primary UI lives in `features/<domain>/`; federation `exposes` can point at a thin root re-export (e.g. `src/products-page.tsx` → `features/catalog/components/products-page.tsx`).
- **Shared across apps:** `packages/mfe-shared` — not duplicated inside each feature.

### File and folder naming (kebab-case)

| Item | Convention | Example |
|------|------------|---------|
| Files | **kebab-case** | `remote-error-boundary.tsx`, `products-page.tsx` |
| Folders | **kebab-case** | `features/cart-route/`, `components/` |
| React components | **PascalCase** | `export function RemoteErrorBoundary` in `remote-error-boundary.tsx` |
| Hooks | **camelCase** with `use` prefix | `useUser` in `use-user.ts` |
| Types / interfaces | **PascalCase** | `RemoteSlotProps` |

Do not use PascalCase or camelCase for **file** names (avoid `RemoteErrorBoundary.tsx`, `productsPage.tsx`).

### Other engineering preferences

- Split by **business domain**, not technical layer.
- Keep shell owning routing, nav, session context, and error boundaries.
- Keep remote `exposes` surfaces small.
- Prefer `@repo/mfe-shared` for types and tokens over duplicating in remotes.
- Keep route/page files thin; business logic stays in `features/`.
- Do not add dependencies unless the spec or user requires it.
