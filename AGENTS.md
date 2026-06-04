# Repository Agent Entry

Entry point for AI agents on the **micro-frontend interview** repo.

## Scope

**Default in-scope paths:**

- `apps/shell`, `apps/mfe-products`, `apps/mfe-cart`, `apps/api`
- `apps/docs` (markdown planning docs only)
- `packages/mfe-shared`, `packages/typescript-config`
- `packages/design-system`, `packages/auth`, `packages/database`, `packages/neon-auth` (when integrating UI, auth, or data)

Do not search or edit other paths unless the user explicitly expands scope.

## Workflow

### Planning (default)

- Do **not** implement application code unless the user explicitly requests implementation.
- **Do** update docs under `apps/docs/` when planning or when the user asks for documentation.

### Implementation

- Follow an approved feature spec in `apps/docs/feature-specs/`.
- Implement one task at a time; update the spec and `00-index.md` when status changes.

## Read first (MFE)

1. [apps/docs/PRD.md](apps/docs/PRD.md)
2. [apps/docs/architecture.md](apps/docs/architecture.md)
3. [apps/docs/feature-specs/00-index.md](apps/docs/feature-specs/00-index.md)
4. Relevant feature spec
5. [apps/docs/AGENTS.md](apps/docs/AGENTS.md) — stack, validation, auth, code conventions

Interview narrative: [apps/docs/interview-guide.md](apps/docs/interview-guide.md)

## Monorepo

Turborepo + Bun workspaces. MFE dev:

```sh
bun run dev          # shell + remotes + api (:3001)
bun run dev:api      # api only
bun run build
```

Human quickstart: [README.md](README.md)

## Rules

- Follow documented feature specs; do not invent requirements.
- Ask when requirements are ambiguous.
- Keep changes scoped to the requested feature or doc task.
- Auth: shell loads user via `apps/api` + `@repo/neon-auth` (see spec **11**); `@repo/auth` (Clerk) is deprecated.
- MFE apps use **`src/features/<name>/`** and **kebab-case** file names — see [apps/docs/AGENTS.md](apps/docs/AGENTS.md#code-conventions).
