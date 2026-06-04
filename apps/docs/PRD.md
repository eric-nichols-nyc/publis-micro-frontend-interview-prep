# Product Requirements Document

## Product

Micro-frontend interview boilerplate — Vite Module Federation demo shop.

## Purpose

A small, runnable monorepo for practicing micro-frontend interview questions: independent remotes, shell routing, shared React, failure handling, and clear domain boundaries.

## Primary users

- **You (candidate):** run the demo, navigate routes, rehearse talking points.
- **Interviewer (optional):** watch shell load remotes, break a remote, see fallback UI.

## Core flows

1. Start dev servers (`bun run dev`).
2. Open shell at http://localhost:5173.
3. Visit `/products` — federated catalog loads.
4. Visit `/cart` — federated cart loads.
5. (Demo) Stop cart remote — `/cart` shows fallback; shell still works.

## Non-goals (baseline — see feature specs for phased additions)

- SSR / Next.js host
- Database-backed catalog (spec **08** uses mock data; DB is future)
- Production deployment automation (spec **09** documents env URLs only)

Phased features (specs in `feature-specs/`): folder refactor (**02**), design system shell (**03**), catalog (**04**), cart (**05**), optional checkout remote (**06**), Clerk auth (**07**), cross-MFE cart (**08**), prod env (**09**), E2E (**10**).

## Technical direction

- **Host:** `apps/shell` — React Router, federation consumer, mock auth context.
- **Remotes:** `apps/mfe-products`, `apps/mfe-cart` — one primary expose each.
- **Shared:** `packages/mfe-shared` — types, tokens, mock user, federation shared config.
- **Docs:** `apps/docs/` — PRD, architecture, feature specs (this folder).
- **Auth:** mock user only; shell-owned; types in `mfe-shared`.

## Success criteria

- Three apps run via `bun run dev` without manual URL wiring.
- `/products` and `/cart` load remote UI with a single React instance.
- Remote failure does not crash the shell.
- Documentation in `apps/docs/` matches the running code.
