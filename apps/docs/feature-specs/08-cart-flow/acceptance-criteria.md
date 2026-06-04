# Cart flow — Acceptance criteria

Measurable conditions for marking each phase **Completed** in [00-index.md](../00-index.md).

---

## Phase 1 — Cross-MFE

Required for phase 1 sign-off. Optional items marked **(opt)**.

### A1 — Shared contract

- [x] **A1.1** `CartLine`, extended `ProductsRemoteProps`, and `CartRemoteProps` exported from `@repo/mfe-shared`.
- [x] **A1.2** `bun run typecheck` passes for `mfe-shared`, `shell`, `mfe-products`, `mfe-cart`.
- [x] **A1.3** No `import` from `mfe_cart` inside `mfe-products` or vice versa.

### A2 — Add to cart

- [x] **A2.1** Signed-in (or demo) user on `/products` can click **Add to cart** on a catalog card.
- [x] **A2.2** Adding the same `productId` again increases `quantity` on one line (not duplicate rows).
- [x] **A2.3** Line shows correct `name` and `price` from catalog product.

### A3 — Cart page

- [x] **A3.1** Navigating to `/cart` shows the added line(s) without restarting dev servers.
- [x] **A3.2** Quantity +/- and remove line work via shell-provided handlers.
- [x] **A3.3** Subtotal matches sum of `price * quantity`.
- [x] **A3.4** Empty cart shows empty state when all lines removed.

### A4 — Build

- [x] **A4.1** `bun run build --filter=shell --filter=mfe-products --filter=mfe-cart` succeeds.

### A5 — Documentation

- [x] **A5.1** `interview-guide.md` mentions shell-orchestrated cart flow.
- [x] **A5.2** Shell nav displays cart item count that updates after add.

### A6 — Explicit non-goals (phase 1)

- [x] **A6.1** Refreshing the browser does **not** require cart persistence (may reset — expected until phase 2).
- [x] **A6.2** No cart routes under `apps/api`.

---

## Phase 2 — Persisted API

Required only when phase 2 is approved and implemented.

### B1 — Database

- [ ] **B1.1** Migration applies cleanly; `Cart` / `CartItem` relate to `User` and `Product`.
- [ ] **B1.2** `priceSnapshot` stored on add; line total uses snapshot, not live catalog price.

### B2 — API

- [ ] **B2.1** Unauthenticated `POST /api/cart/items` returns **401**.
- [ ] **B2.2** Authenticated user can add, update, remove, clear cart; integration tests pass.
- [ ] **B2.3** User A cannot read or mutate user B’s cart (**403** or empty scoped cart).
- [ ] **B2.4** Invalid `productId` returns **404** or **400** per api-design.

### B3 — Shell + remotes

- [ ] **B3.1** After refresh, cart lines reappear for signed-in user.
- [ ] **B3.2** Remotes still use same props as phase 1 (no remote API imports).
- [ ] **B3.3** Add from `/products` persists after refresh.

### B4 — Auth gate

- [x] **B4.1** [07-auth-e2e-gate.md](../07-auth-e2e-gate.md) checklist passed with Neon (2026-06-04).
