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

## Non-goals (v1)

- Real authentication (OAuth, Clerk, sessions API)
- SSR / Next.js host
- Database or API backend
- Full design system (shadcn) integration
- E2E test suite
- Production deployment automation
- Removing all legacy next-forge folders (tracked separately)

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
