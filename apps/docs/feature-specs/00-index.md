# Feature Specs Index

| # | Feature | Spec | Status | Depends on |
|---|---------|------|--------|------------|
| 01 | MFE v1 baseline | [01-mfe-v1-baseline.md](./01-mfe-v1-baseline.md) | **Completed** | — |
| 02 | Feature folder refactor | [02-feature-folder-refactor.md](./02-feature-folder-refactor.md) | **Completed** | 01 |
| 03 | Shell design system | [03-shell-design-system.md](./03-shell-design-system.md) | Draft | 02 recommended |
| 04 | Products catalog | [04-products-catalog.md](./04-products-catalog.md) | **Completed** | 02 |
| 05 | Cart (interactive) | [05-cart.md](./05-cart.md) | **Completed** | 02, 04 recommended |
| 06 | Checkout remote (optional) | [06-checkout-remote.md](./06-checkout-remote.md) | Draft | 02 |
| 07 | Shell auth (Neon + API) | [07-shell-auth.md](./07-shell-auth.md) · **[E2E gate](./07-auth-e2e-gate.md)** | **In progress** (gate required) | 11 (API), Neon Auth project |
| 08 | Cross-MFE add to cart | [08-cross-mfe-cart-sync.md](./08-cross-mfe-cart-sync.md) | Draft | 04, 05 |
| 09 | Production remote URLs | [09-prod-remote-env.md](./09-prod-remote-env.md) | Draft | 01 |
| 10 | E2E smoke tests | [10-e2e-smoke.md](./10-e2e-smoke.md) | Draft | 01 |
| 11 | API application | [02-api-application/overview.md](./02-api-application/overview.md) | **In progress** | DB migrate, Neon Auth |
| 12 | API product catalog | [12-api-product-catalog.md](./12-api-product-catalog.md) | **Completed** | 11 (API), 04, 07 (route gate) |

Template: [99-template.md](./99-template.md)

Multi-file specs: [02-api-application/](./02-api-application/) (folder id `02`; index **11** to avoid clash with [02-feature-folder-refactor](./02-feature-folder-refactor.md)).

## Suggested implementation order

1. **02** — structure (unblocks conventions)
2. **03** — shell UI polish
3. **04** → **05** — domain features
4. **08** — cross-MFE story (strong interview)
5. **11** + **07** — API session verify + shell sign-in/out (active on `feature/shell-auth`)
6. **06** — only if you want three remotes
7. **09** → **10** — deploy and CI hardening

**07** — Code through T2.3 is done. **Must pass [07-auth-e2e-gate.md](./07-auth-e2e-gate.md)** (sign-up, sign-in, sign-out on shell + `/api/me` + remotes) before other features. API: Neon env only (`DEV_AUTH_*` off). See [auth-strategy.md](./02-api-application/auth-strategy.md).

## Status values

- **Draft** — not approved for implementation
- **Approved** — ready for task-by-task implementation (`Implement T1 only…`)
- **In Progress** — active work
- **Completed** — matches the repo

## How to approve

Change **Draft** → **Approved** in the spec’s Status section and in this table, then ask the agent to implement one task at a time.
