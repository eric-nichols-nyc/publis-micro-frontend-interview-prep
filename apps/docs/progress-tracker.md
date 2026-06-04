# Progress Tracker

## Current Goal

Lean monorepo: MFE demo + retained platform packages (design-system, auth, database).

## In Progress

- (none)

## Completed

- Vite Module Federation demo: shell, mfe-products, mfe-cart
- `packages/mfe-shared`
- Agent docs under `apps/docs/`
- Code conventions (feature folders, kebab-case files)
- Removed unused apps and packages (kept design-system, auth, database)
- Removed root `docs/` site, Mintlify leftovers in `apps/docs/`

## Next Up

- Refactor shell/remotes to `src/features/` + kebab-case files
- Optional: wire `@repo/design-system` or `@repo/auth` into shell via feature spec
- Feature specs for E2E, prod remote URLs

## Open Questions

- Single mega-spec vs multiple feature specs for future work?
