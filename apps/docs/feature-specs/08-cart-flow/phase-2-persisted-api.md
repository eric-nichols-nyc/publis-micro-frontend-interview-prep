# Cart flow — Phase 2: Persisted cart (API + Postgres)

## Status

**Completed** — implemented P2-T1 through P2-T5 (2026-06-04). Prerequisite [07-auth-e2e-gate.md](../07-auth-e2e-gate.md) — **passed**.

## Goal

Persist each authenticated user’s active cart in Neon Postgres, expose REST cart endpoints on `apps/api`, and change **shell `cart-session` only** to load and mutate via HTTP — **without** changing phase 1 remote prop contracts.

## User story

As a signed-in shopper, I want my cart to survive a browser refresh and stay private to my account.

## Resolved decisions (draft)

| ID | Decision |
|----|----------|
| P2-1 | **Shell** remains the only browser client for cart API (remotes stay props-only) |
| P2-2 | Reuse phase 1 `CartRemoteProps` / `ProductsRemoteProps` — no contract break |
| P2-3 | **No** `@repo/cart` Zustand package unless shell state becomes unwieldy; prefer `cart-session` + `fetch` |
| P2-4 | One **active** cart per user (`status = active`) |
| P2-5 | `cart_items.price` stored as **`priceSnapshot`** (integer USD at add time) |
| P2-6 | Validate `product_id` exists on add (spec **12** `Product` table) |
| P2-7 | Auth required for all cart mutations and `GET /api/cart` |

## Requirements (summary)

### Database (`packages/database`)

- [x] `Cart` model — `id`, `userId` (FK to app `User`), `status`, timestamps
- [x] `CartItem` model — `id`, `cartId`, `productId`, `quantity`, `priceSnapshot`, `nameSnapshot` (optional), timestamps
- [x] Unique constraint: one active cart per user; unique `(cartId, productId)` per line
- [x] Migration + no seed required for empty carts

### API (`apps/api`)

- [x] `GET /api/cart` — active cart + items (or empty cart shell)
- [x] `POST /api/cart/items` — body `{ productId, quantity? }`; merge duplicate product
- [x] `PATCH /api/cart/items/:itemId` — update quantity; remove at 0
- [x] `DELETE /api/cart/items/:itemId`
- [x] `DELETE /api/cart` — clear all items
- [x] Auth middleware; ownership checks (user cannot read/write another user’s cart)
- [x] Integration tests in `apps/api/tests/routes.test.ts`

### Shell

- [x] `cart-session` hydrates from `GET /api/cart` on session available
- [x] `addToCart` / qty / remove call API then refresh local lines (optimistic update optional, not required v1)
- [x] Map API DTO → `CartLine` for remotes (same shape as phase 1)
- [x] Loading/error states on cart routes

### Documentation

- [x] Extend [02-api-application/api-design.md](../02-api-application/api-design.md) with cart endpoints
- [x] Update [12-api-product-catalog.md](../12-api-product-catalog.md) out-of-scope note → “cart lines in DB (phase 2)”

## Out of scope (phase 2 v1)

- Inventory reservation / `inventory_count` on products
- Product `description` field
- Remotes calling API directly
- `@repo/cart` shared Zustand across federated bundles
- Checkout / payments (spec **06**)
- Admin cart inspection

## Data model (reference)

Align `Product` with existing schema (spec **12**). Cart references `Product.id` (`sku_*`).

```prisma
model Cart {
  id        String   @id @default(cuid())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  status    String   @default("active") // active | abandoned | ordered
  items     CartItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, status]) // only one active per user — adjust if multiple statuses needed
}

model CartItem {
  id             String   @id @default(cuid())
  cartId         String
  cart           Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId      String
  product        Product  @relation(fields: [productId], references: [id])
  quantity       Int
  priceSnapshot  Int
  nameSnapshot   String?  // optional display stability
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([cartId, productId])
}
```

**Why `priceSnapshot`:** checkout and cart totals must not change if catalog price changes later.

> **Note:** Refine `@@unique([userId, status])` during implementation if Prisma/Postgres semantics need a partial unique index for `active` only.

## API sketch

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/cart` | Yes | Active cart + items |
| POST | `/api/cart/items` | Yes | Add or bump quantity |
| PATCH | `/api/cart/items/:itemId` | Yes | Set quantity |
| DELETE | `/api/cart/items/:itemId` | Yes | Remove line |
| DELETE | `/api/cart` | Yes | Clear cart |

Error envelope: match existing API (`UNAUTHORIZED`, `NOT_FOUND`, `VALIDATION_ERROR`).

## Frontend sync strategy

```txt
Phase 1:  shell state ──props──▶ remotes
Phase 2:  shell state ◀──hydrate── API
          shell action ──POST/PATCH/DELETE──▶ API ──▶ refresh or optimistic merge
          same props ──▶ remotes
```

## Implementation tasks (outline only)

Implement one task per agent session when phase 2 is **Approved** — detail in [implementation-plan.md](./implementation-plan.md).

- **P2-T1** — Prisma models + migration
- **P2-T2** — Cart service + routes + tests
- **P2-T3** — Shell API client + hydrate `cart-session`
- **P2-T4** — Wire mutations; error UI
- **P2-T5** — Docs + acceptance sign-off

## Agent implementation prompt

Do **not** start phase 2 until the user explicitly approves this doc and phase 1 is **Completed**.

When approved: implement **P2-T1 only** from [implementation-plan.md](./implementation-plan.md).
