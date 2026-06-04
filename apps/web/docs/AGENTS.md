# Web App Agent Guide

This is the main operating manual for agents working in `apps/web`.

## Read Order

Before coding:

1. `PRD.md`
2. `progress-tracker.md`
3. `feature-specs/00-index.md`
4. Relevant feature spec

## Stack

- Next.js App Router (port **3001** locally)
- React, TypeScript, Tailwind CSS v4
- UI: `@repo/design-system` (shadcn/ui)
- Validation: Zod
- Mutations: Server Actions or Route Handlers

## Shared Packages

UI comes from `@repo/design-system` (components, theme, `DesignSystemProvider`). Prefer it over new UI in `apps/web`.

Other `@repo/*` deps (cms, seo, i18n, analytics, security, etc.)—check `apps/web/package.json` before changing. Env: `apps/web/.env.local` (see `.env.example`).

## Architecture Rules

- Keep routes thin.
- Put feature code under `features/<feature-name>/`.
- Prefer small, focused components.
- Put reusable client logic in `hooks/`.
- Put validation schemas in `schemas/` or feature-local `lib/`.
- Do not add new dependencies unless necessary.
- Prefer existing UI components before creating new ones.

## Feature Folder Pattern

Example:

```txt
features/auth/
  components/
    signup-form.tsx
  actions/
    signup.ts
  schemas/
    signup-schema.ts
  types.ts
```

## Spec-Driven Workflow

For new features:

1. Create or update a feature spec.
2. Register it in `feature-specs/00-index.md`.
3. Set the current goal in `progress-tracker.md`.
4. Implement one task at a time.
5. Verify the work.
6. Update progress tracker.
7. Mark feature status in the index.

## Progress Tracker Rule

Before starting work:

- Read `progress-tracker.md`

After meaningful work:

- Update `Current Goal`
- Update `In Progress`
- Add completed work to `Completed`
- Update `Next Up`
- Add unresolved decisions to `Open Questions`

## Validation

From repo root or `apps/web`, run the smallest useful check first:

```sh
# apps/web only
cd apps/web && bun run typecheck

# repo-wide (when needed)
bun run check    # lint/format (Ultracite)
bun run test
bun run build --filter=web
```

## Engineering Preferences

- Follow SOLID principles
- Prefer composition over inheritance
- Keep routes thin
- Keep business logic out of UI components
- Prefer feature-based architecture
- Use meaningful names
- Avoid premature abstractions
- Duplicate twice, abstract on the third use
- Prefer readability over cleverness
- Write comments to explain WHY, not WHAT
