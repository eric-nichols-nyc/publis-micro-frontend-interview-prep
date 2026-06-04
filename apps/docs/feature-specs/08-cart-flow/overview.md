# Cart flow — Overview

## Status

**Phase 1 completed** — cross-MFE in-memory cart (T1–T5). **Phase 2** ([persisted API](./phase-2-persisted-api.md)) **Completed** (P2-T1–P2-T5, 2026-06-04).

## Goal

Deliver the full **product → cart** shopper journey in two phases without redoing remote contracts or cart UI:

1. **Phase 1** — Cross-MFE add-to-cart: shell-owned in-memory cart, props/callbacks to remotes ([phase-1-cross-mfe.md](./phase-1-cross-mfe.md)).
2. **Phase 2** — Persisted cart in Postgres + authenticated API ([phase-2-persisted-api.md](./phase-2-persisted-api.md)).

## Why cart is its own domain

| Concern | Owner |
|---------|--------|
| Catalog listing, search UI | `mfe-products` (data from shell today) |
| Cart line display, qty UX | `mfe-cart` |
| **Who owns cart truth (v1)** | **Shell** `cart-session` — interview-correct orchestration |
| **Who owns cart truth (v2)** | **API + Postgres** — shell hydrates and mutates via HTTP |
| Product master data | API + DB (spec **12**, done) |

Cart state must not live in a shared mutable global imported by both remotes. The shell (then the API) is the integration point.

## Relationship to other specs

| Spec | Relationship |
|------|----------------|
| **04** Products catalog | UI patterns; product cards |
| **05** Cart (interactive) | Cart remote UX; phase 1 makes it **controlled** by shell props |
| **07** Shell auth | Required before phase 2 mutations; recommended for gated `/products` `/cart` |
| **11** API application | Host for phase 2 cart routes |
| **12** API product catalog | Real `Product` ids/prices for add-to-cart; phase 2 validates `product_id` |

**Supersedes:** single-file [08-cross-mfe-cart-sync.md](../08-cross-mfe-cart-sync.md) (redirect only).

## Architecture (end state)

See **[architecture.md](./architecture.md)** for diagrams (sequence, ownership, routes) and interview notes.

**Invariant across phases:** remotes do not import each other; remote prop types live in `@repo/mfe-shared`. Phase 2 changes **shell internals only**, not the federated contract from phase 1.

## Documentation map

| Doc | Purpose |
|-----|---------|
| [overview.md](./overview.md) | This file — scope, phases, dependencies |
| [architecture.md](./architecture.md) | **How it works** — visuals, flows, ownership |
| [phase-1-cross-mfe.md](./phase-1-cross-mfe.md) | Implement now — types, shell session, add button |
| [phase-2-persisted-api.md](./phase-2-persisted-api.md) | Plan later — schema, API, hydrate |
| [implementation-plan.md](./implementation-plan.md) | Task order and files |
| [acceptance-criteria.md](./acceptance-criteria.md) | Measurable done conditions per phase |

## Execution order (index **08**)

1. Prerequisites met: **04**, **05**, **07**, **12** (done).
2. Implement **phase 1** only (one task per agent session) — start with T1 in [phase-1-cross-mfe.md](./phase-1-cross-mfe.md).
3. When phase 1 is **Completed**, approve **phase 2** separately.

Do **not** implement phase 2 tables, `@repo/cart` Zustand package, or cart REST routes while working phase 1.

## Agent entry point

```txt
Implement T1 only from apps/docs/feature-specs/08-cart-flow/phase-1-cross-mfe.md
```

Before coding: read `apps/docs/AGENTS.md`, this overview, and the phase doc.

After coding: update phase doc checkboxes, [acceptance-criteria.md](./acceptance-criteria.md), and [00-index.md](../00-index.md) if status changed.
