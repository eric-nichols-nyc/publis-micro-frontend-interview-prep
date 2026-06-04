# API Application — Overview

## Status

**In progress** — `apps/api` ships `/health`, `/api/me`, user routes, and `@repo/neon-auth` verification. Shell integration continues in spec **07** (`feature/shell-auth`).

## Goal

Introduce a dedicated **API application** (`apps/api`) that becomes the authoritative backend for authentication verification, user profile data, and user-owned persistence—while the existing React + Vite shell and micro-frontends remain UI-only clients.

## Purpose

The API application exists to:

1. **Centralize trust** — Only the API validates sessions and enforces authorization before touching Postgres.
2. **Expose a stable HTTP contract** — Shell and remotes (via shell) call versioned REST endpoints instead of embedding database or auth SDK logic in the browser.
3. **Scale the platform** — New domains (catalog persistence, cart sync, AI features) add routes and services here without splitting business logic across MFE bundles.

This supports a **Senior Frontend Engineer portfolio** narrative today (clear boundaries, real auth, real DB) and a **production SaaS** trajectory tomorrow (RBAC, observability, horizontal scaling).

## Responsibilities

| In scope | Out of scope |
|----------|----------------|
| HTTP API (REST v1) | Server-side rendering of React pages |
| Session / token verification (Neon Auth) | Module Federation remote bundling |
| Current user and user CRUD (owned data) | Client-side routing (shell owns React Router) |
| Prisma access via `@repo/database` | Direct browser → Postgres access |
| Health and readiness probes | Long-running AI inference workers (future spec may add queue/worker) |
| Structured errors, logging hooks | Replacing mock catalog/cart UI in remotes (separate MFE specs) |

## Boundaries

```txt
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                         │
│  • Shell + MFE remotes — presentation, client state, UX        │
│  • No DATABASE_URL, no service-role secrets                      │
│  • Calls API with credentials (cookie and/or Bearer)             │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (same-site or configured CORS)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  apps/api — sole writer/reader for protected business data       │
│  • Auth middleware → services → repositories → Prisma/Neon       │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
       Neon Auth (identity)          Neon Postgres (data)
```

- **Shell** may hold auth *UI* and session *artifacts* (cookies/tokens from Neon Auth SDK) but must not be the source of truth for “is this user allowed to read row X?”
- **Micro-frontends** must not call the API directly in v1; they receive user context from the shell (existing `RemoteSlotProps` pattern) until a spec explicitly allows remote → API with scoped tokens.
- **Shared packages** supply types and clients; the API app owns runtime wiring and HTTP handlers.

## Relationship to the shell app

| Concern | Shell | API |
|---------|-------|-----|
| Routing | Owns React Router (`/`, `/products`, `/cart`, …) | Owns `/health`, `/api/*` |
| Auth UX | Sign-in/out, session refresh UI (Neon Auth client) | Validates session on every protected request |
| User display | Maps API `GET /api/me` (or Neon Auth profile) into `UserProvider` / nav | Returns canonical profile + DB fields |
| Data fetching | `fetch('/api/...')` or typed client from `@repo/types` | Executes queries and authorization checks |

**Target flow:** After sign-in, shell loads `GET /api/me` to hydrate app state, then passes a read-only user snapshot to remotes via props (extends spec **07** direction from Clerk mock → real auth, but via API + Neon Auth).

## Relationship to micro-frontends

| Phase | MFE behavior |
|-------|----------------|
| **v1 (this spec)** | Remotes remain props-only; shell is the only API client. |
| **v2 (future)** | Optional BFF-style calls from shell only; or scoped public endpoints for catalog with no PII. |
| **Anti-pattern** | Each remote importing Neon Auth or Prisma — forbidden. |

Module Federation boundaries stay unchanged: remotes are deployable UI slices; the API is a separate deployable service (port **3001** in dev, env-configured in prod).

## Shared packages (planned usage)

| Package | Role for API |
|---------|----------------|
| `@repo/database` | Prisma client, Neon adapter, migrations (existing) |
| `@repo/neon-auth` | Neon Auth client, server verification, design-system provider slot |
| `@repo/types` | **New** — shared DTOs, API error shapes, route params (proposed) |
| `@repo/mfe-shared` | Frontend `User` type alignment; API maps DB user → shared shape |
| `@repo/typescript-config` | TS base for `apps/api` |

## Dependencies on other specs

| Spec | Relationship |
|------|----------------|
| **07-shell-auth** | Shell integrates Neon Auth client; API verifies same sessions. Prefer implementing API auth foundation before or in parallel with shell auth swap. |
| **04 / 05** | Catalog/cart may later persist via API; not required for API v1. |
| **09-prod-remote-env** | Production adds `VITE_API_URL` (shell) and API deployment URL + CORS allowlist. |

## Document map

| File | Contents |
|------|----------|
| [requirements.md](./requirements.md) | Functional and non-functional requirements |
| [architecture.md](./architecture.md) | Request flow and layer responsibilities |
| [folder-structure.md](./folder-structure.md) | `apps/api` layout |
| [auth-strategy.md](./auth-strategy.md) | Neon Auth, middleware, RBAC readiness |
| [database-strategy.md](./database-strategy.md) | Postgres, repositories, migrations |
| [api-design.md](./api-design.md) | Endpoints, payloads, cross-system flows |
| [implementation-plan.md](./implementation-plan.md) | Phased tasks (no code in spec) |
| [testing-plan.md](./testing-plan.md) | Test pyramid and tooling |
| [acceptance-criteria.md](./acceptance-criteria.md) | Measurable done definition |

## Index note

Registered in [00-index.md](../00-index.md) as feature **11** (folder id `02-api-application`) because index slot **02** is already [feature-folder-refactor](../02-feature-folder-refactor.md).
