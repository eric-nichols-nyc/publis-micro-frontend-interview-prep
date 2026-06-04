# Feature Specs Index

| # | Feature | Spec | Status | Depends on |
|---|---------|------|--------|------------|
| 01 | MFE v1 baseline | [01-mfe-v1-baseline.md](./01-mfe-v1-baseline.md) | **Completed** | — |
| 02 | Feature folder refactor | [02-feature-folder-refactor.md](./02-feature-folder-refactor.md) | **Completed** | 01 |
| 03 | Shell design system | [03-shell-design-system.md](./03-shell-design-system.md) | Draft | 02 recommended |
| 04 | Products catalog | [04-products-catalog.md](./04-products-catalog.md) | **Completed** | 02 |
| 05 | Cart (interactive) | [05-cart.md](./05-cart.md) | **Completed** | 02, 04 recommended |
| 06 | Checkout remote (optional) | [06-checkout-remote.md](./06-checkout-remote.md) | Draft | 02 |
| 07 | Shell auth (Neon + API) | [07-shell-auth.md](./07-shell-auth.md) · **[E2E gate](./07-auth-e2e-gate.md)** | **Completed** | 11 (API), Neon Auth project |
| 08 | Cart flow (cross-MFE + persisted) | [08-cart-flow/overview.md](./08-cart-flow/overview.md) | **Phase 1 completed** · phase 2 draft | 04, 05, 07, 12 |
| 09 | Production remote URLs | [09-prod-remote-env.md](./09-prod-remote-env.md) | Draft | 01 |
| 10 | E2E smoke tests | [10-e2e-smoke.md](./10-e2e-smoke.md) | Draft | 01 |
| 11 | API application | [02-api-application/overview.md](./02-api-application/overview.md) | **In progress** | DB migrate, Neon Auth |
| 12 | API product catalog | [12-api-product-catalog.md](./12-api-product-catalog.md) | **Completed** | 11 (API), 04, 07 (route gate) |

Template: [99-template.md](./99-template.md)

Multi-file specs:

- [02-api-application/](./02-api-application/) — folder id `02`; index **11** (avoids clash with [02-feature-folder-refactor](./02-feature-folder-refactor.md))
- [08-cart-flow/](./08-cart-flow/) — index **08**; [architecture](./08-cart-flow/architecture.md); [legacy redirect](./08-cross-mfe-cart-sync.md)

## Execution roadmap

Stable spec **numbers** are IDs, not strict build order. Use this sequence to avoid duplicate work:

| Phase | Specs | Notes |
|-------|-------|-------|
| **Done** | 01, 02, 04, 05, 07, 12, **08 phase 1** | Catalog API; auth gate; [cross-MFE cart](./08-cart-flow/phase-1-cross-mfe.md) |
| **Next** | **08 phase 2** or **09**/**10** | Persisted cart API · or deploy/E2E hardening |
| **In progress** | 11 | API app baseline (cart API in 08 phase 2) |
| **Optional** | 03, 06 | Polish / third remote |
| **Hardening** | 09 → 10 | Deploy URLs, E2E smoke |

**08** — Phase 1 **Completed**. To start phase 2, approve [phase-2-persisted-api.md](./08-cart-flow/phase-2-persisted-api.md) and implement **P2-T1** only. See [auth-strategy.md](./02-api-application/auth-strategy.md).

## Suggested implementation order (legacy list)

1. **02** — structure (unblocks conventions)
2. **03** — shell UI polish
3. **04** → **05** — domain features
4. **08 phase 1** — cross-MFE cart ([implementation-plan](./08-cart-flow/implementation-plan.md))
5. **11** + **07** — API session verify + shell sign-in/out
6. **08 phase 2** — persisted cart API
7. **06** — only if you want three remotes
8. **09** → **10** — deploy and CI hardening

## Status values

- **Draft** — not approved for implementation
- **Approved** — ready for task-by-task implementation (`Implement T1 only…`)
- **In Progress** — active work
- **Completed** — matches the repo

## How to approve

Change **Draft** → **Approved** in the spec’s Status section (phase doc for **08**) and in this table, then ask the agent to implement one task at a time.

For **08**, approve [phase-1-cross-mfe.md](./08-cart-flow/phase-1-cross-mfe.md) first; approve [phase-2-persisted-api.md](./08-cart-flow/phase-2-persisted-api.md) only after phase 1 is **Completed**.
