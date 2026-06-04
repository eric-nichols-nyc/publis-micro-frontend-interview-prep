# Repository Agent Entry

This is the root entry point for AI agents.

## Scope

Default in-scope paths:

- `apps/web`
- `packages/design-system`

Do not search or edit other apps or packages unless the user explicitly expands scope.

## Monorepo

This repo is a [next-forge](https://github.com/vercel/next-forge) Turborepo. Shared libraries are imported as `@repo/<name>`.

When scope expands or you need upstream monorepo details, read only what applies to the task:

- `skills/next-forge/references/setup.md` — install, env vars, database, local dev
- `skills/next-forge/references/architecture.md` — apps, ports, Turborepo scripts
- `skills/next-forge/references/packages.md` — package APIs (read relevant sections only)

Cross-app conventions:

- Prefer Server Components; add `'use client'` only where needed.
- Optional integrations degrade gracefully when env vars are missing.
- Add shadcn/ui components: `npx shadcn@latest add <component> -c packages/design-system`

## Read First

For web app work:

1. Read `apps/web/AGENTS.md`
2. Read `apps/web/docs/AGENTS.md`
3. Read `apps/web/docs/progress-tracker.md`
4. Read the relevant feature spec in `apps/web/docs/feature-specs/`

For main app work (`apps/app`, when scope is expanded):

1. Read `apps/app/AGENTS.md`
2. Read `apps/app/docs/AGENTS.md`
3. Read `apps/app/docs/progress-tracker.md`
4. Read the relevant feature spec in `apps/app/docs/feature-specs/`

## Rules

- Follow documented feature specs.
- Do not invent requirements.
- Ask when requirements are ambiguous.
- Keep changes scoped to the requested feature.
- Update the progress tracker after meaningful work.
