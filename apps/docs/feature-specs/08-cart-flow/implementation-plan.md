# Cart flow — Implementation plan

Planning tasks only. **One task per agent session** unless the user explicitly requests more.

## Prerequisites

| Prerequisite | Spec | Status |
|--------------|------|--------|
| Feature folders + federation | **02** | Completed |
| Products catalog UI | **04** | Completed |
| Interactive cart remote | **05** | Completed |
| DB-backed product catalog + shell fetch | **12** | Completed |
| Shell auth + `/api/me` | **07** | Completed — E2E gate passed |
| API app baseline | **11** | In progress — required for phase 2 |

Approve phase in [overview.md](./overview.md) and [00-index.md](../00-index.md) before coding.

---

## Phase 1 — Cross-MFE (implement now)

Detail: [phase-1-cross-mfe.md](./phase-1-cross-mfe.md)

| Task | Summary | Primary files |
|------|---------|---------------|
| **T1** | Shared `CartLine` + remote prop types | `packages/mfe-shared/src/types.ts`, `apps/shell/src/remotes.d.ts` |
| **T2** | Shell `cart-session` + provider + route wiring | `apps/shell/src/features/cart-session/**`, `products-route-page.tsx`, `cart-route-page.tsx`, `app.tsx` |
| **T3** | Add button + controlled `CartWidget` | `mfe-products/.../product-list.tsx`, `mfe-cart/.../cart-widget.tsx`, `use-cart.ts` |
| **T4** | (Optional) Header cart count | `shell-chrome/.../shell-layout.tsx` |
| **T5** | Interview guide blurb | `apps/docs/interview-guide.md` |

**Phase 1 completion:** ✅ All items in [acceptance-criteria.md](./acceptance-criteria.md#phase-1--cross-mfe) checked; phase-1 doc and index **08** updated (2026-06-04).

---

## Phase 2 — Persisted API (later)

Detail: [phase-2-persisted-api.md](./phase-2-persisted-api.md)

| Task | Summary | Primary files |
|------|---------|---------------|
| **P2-T1** | `Cart` / `CartItem` schema + migration | `packages/database/prisma/schema.prisma`, `migrations/` |
| **P2-T2** | Cart lib + routes + tests | `apps/api/src/lib/cart.ts`, `routes/cart.ts`, `tests/routes.test.ts` |
| **P2-T3** | Shell cart API client + hydrate on auth | `apps/shell/src/features/cart-session/lib/cart-api-client.ts`, hook updates |
| **P2-T4** | Mutations + loading/error UI | `use-shell-cart.ts`, route pages |
| **P2-T5** | API design doc + index status | `02-api-application/api-design.md`, `00-index.md` |

**Phase 2 completion:** [acceptance-criteria.md](./acceptance-criteria.md#phase-2--persisted-api) + auth gate satisfied.

---

## Anti-duplication checklist

- [ ] Define `CartLine` once in `@repo/mfe-shared` (phase 1) — phase 2 maps API → same type
- [ ] Do not add `packages/cart` or federated Zustand store
- [ ] Do not re-fetch catalog inside `mfe-products` for add — shell passes `onAddToCart` and resolves `Product` from existing `products` prop
- [ ] Do not implement Prisma cart models during phase 1 tasks
