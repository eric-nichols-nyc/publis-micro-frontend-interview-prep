# Micro-frontend interview prep

A **Turborepo** workspace for practicing micro-frontend interviews: Vite Module Federation with a shell host and two domain remotes (products, cart).

## Apps

| App | Port | Role |
|-----|------|------|
| `shell` | 5173 | Host — routing, nav, mock auth, error boundaries |
| `mfe-products` | 5174 | Remote — `ProductsPage` |
| `mfe-cart` | 5175 | Remote — `CartWidget` |

## Packages

| Package | Role |
|---------|------|
| `@repo/mfe-shared` | Types, tokens, mock user, federation shared config (used by MFE apps) |
| `@repo/typescript-config` | Shared TypeScript configs |
| `@repo/design-system` | shadcn/ui components (retained for future shell UI) |
| `@repo/auth` | Clerk auth utilities (retained; MFE demo uses mock user today) |
| `@repo/database` | Prisma + Neon (retained for future features) |

## Getting started

**Prerequisites:** Node.js 20+, [Bun](https://bun.sh)

```sh
bun install
bun run dev
```

Open **http://localhost:5173**

### Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Shell + remotes |
| `bun run build` | Build all workspace packages with a `build` script |
| `bun run typecheck` | Typecheck across workspace |
| `bun run check` / `fix` | Lint and format |
| `bun run migrate` | Prisma migrate (`packages/database`) |
| `bun run bump-ui` | Add shadcn components to design-system |

### Failure demo

Stop only `mfe-cart`, visit http://localhost:5173/cart — fallback UI; shell nav still works.

## Documentation

All planning docs: **[apps/docs/](apps/docs/)**

- [PRD](apps/docs/PRD.md) · [Architecture](apps/docs/architecture.md) · [Feature specs](apps/docs/feature-specs/00-index.md) · [Interview guide](apps/docs/interview-guide.md)

Agents: [AGENTS.md](AGENTS.md) → [apps/docs/AGENTS.md](apps/docs/AGENTS.md)

## Structure

```txt
apps/
  shell/
  mfe-products/
  mfe-cart/
  docs/                 # PRD, specs, interview guide (markdown)
packages/
  mfe-shared/
  typescript-config/
  design-system/
  auth/
  database/
```

## License

MIT
