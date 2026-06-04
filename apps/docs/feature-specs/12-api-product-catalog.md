# Feature Spec: API product catalog (database-backed)

## Status

**Approved** — open decisions resolved (2026-06-04).

## Goal

Persist a product catalog in Neon Postgres, expose public read-only API endpoints, and wire the shell → `mfe-products` flow so the catalog remote renders database-backed products instead of client mocks.

## User story

As a **shopper** on `/products`, I want to browse a real catalog loaded from the API so the demo reflects a production-style data boundary (DB → API → shell → remote).

## Resolved decisions

| ID | Decision |
|----|----------|
| OD-1 | **Public reads** — no auth middleware on product routes |
| OD-2 | **String `id`** as `@id` (`sku_1`, …) |
| OD-3 | **Integer dollars** (`Int`) for `price` |
| OD-4 | **20 products** in seed |
| OD-5 | **Bare array** `[{...}]` for `GET /api/products` |
| OD-6 | **Shell → remote wiring in scope** — shell fetches; remote receives `products` prop |
| OD-7 | Paths **`GET /api/products`** and **`GET /api/products/:id`** (matches existing API prefix) |

Note: Shell route `/products` may remain behind `AuthRequired` (spec **07**); catalog **API** is public regardless.

## Requirements

### Database

- [ ] Add `Product` model to `packages/database/prisma/schema.prisma`
- [ ] Create and apply a Prisma migration
- [ ] Seed script populates **20** products (see [Seed data](#seed-data))

### API

- [ ] `GET /api/products` — public; returns all products sorted by `name` asc
- [ ] `GET /api/products/:id` — public; returns one product or `404 NOT_FOUND`
- [ ] Routes follow existing error envelope
- [ ] Integration tests in `apps/api/tests/routes.test.ts` (no auth required)

### Shell + remote

- [ ] Shared `Product` type in `@repo/mfe-shared`
- [ ] Shell fetches `GET /api/products` on `/products` route; passes `products` to remote
- [ ] `ProductsPage` accepts `products` prop; search/filter runs on prop data
- [ ] Remove `mock-products.ts` as runtime source (delete or keep only for seed reference — prefer single source in seed)
- [ ] Loading and error states in shell or remote when fetch fails

### Documentation

- [ ] Update [02-api-application/api-design.md](./02-api-application/api-design.md) with product endpoints
- [ ] Document migrate + seed commands if missing from README

## Out of scope

- Cart line items referencing DB products (cart remains mock/client state — see **08**)
- Admin CRUD (`POST` / `PATCH` / `DELETE` products)
- Server-side search, pagination, filtering
- Product images / CDN
- Remote calling API directly (shell owns fetch per MFE boundaries)
- Making `/products` shell route public (auth gate unchanged unless user requests separately)

## Architecture impact

| Area | Change |
|------|--------|
| `packages/database` | `Product` model, migration, seed (20 rows) |
| `apps/api` | `lib/products.ts`, `routes/products.ts`, mount in `app.ts` |
| `packages/mfe-shared` | `Product` type; extend remote props for products route |
| `apps/shell` | Fetch catalog; pass `user` + `products` into federated `ProductsPage` |
| `apps/mfe-products` | Consume `products` prop; drop mock default in search hook |

```txt
Browser                Shell (:5173)              apps/api (:3001)       Postgres
   │                        │                          │                    │
   │  navigate /products    │                          │                    │
   │───────────────────────▶│  GET /api/products       │                    │
   │                        │  (no credentials)        │                    │
   │                        │─────────────────────────▶│  findMany          │
   │                        │                          │───────────────────▶│
   │                        │                          │◀───────────────────│
   │                        │◀─────────────────────────│  ProductResponse[] │
   │                        │  ProductsPage            │                    │
   │                        │  { user, products }      │                    │
   │◀───────────────────────│  (federated remote)      │                    │
```

## Data model

```prisma
model Product {
  id        String   @id
  name      String
  price     Int
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

| Field | Type | Notes |
|-------|------|-------|
| `id` | `String` | SKU primary key (`sku_1`, …) |
| `name` | `String` | Display name |
| `price` | `Int` | Whole USD dollars |
| `category` | `String` | Free-text label |

## Seed data

**File:** `packages/database/prisma/seed.ts`

Use `upsert` on `id` for idempotent re-runs.

| id | name | price | category |
|----|------|-------|----------|
| `sku_1` | Trail Runner Pack | 89 | Bags |
| `sku_2` | Insulated Bottle | 24 | Hydration |
| `sku_3` | Merino Base Layer | 65 | Apparel |
| `sku_4` | Carbon Trekking Poles | 54 | Gear |
| `sku_5` | Ultralight Rain Shell | 120 | Apparel |
| `sku_6` | Camp Stove Mini | 42 | Cooking |
| `sku_7` | Down Sleeping Bag 20°F | 199 | Sleep |
| `sku_8` | Grip Trek Socks (3-pack) | 28 | Apparel |
| `sku_9` | Compact Headlamp Pro | 45 | Lighting |
| `sku_10` | Titanium Cook Pot 900ml | 38 | Cooking |
| `sku_11` | Softshell Hiking Pants | 78 | Apparel |
| `sku_12` | Trail Gaiters | 32 | Apparel |
| `sku_13` | Inflatable Sleeping Pad | 95 | Sleep |
| `sku_14` | Quick-Dry Camp Towel | 18 | Accessories |
| `sku_15` | Bear Canister 7L | 72 | Safety |
| `sku_16` | GPS Handheld Navigator | 249 | Electronics |
| `sku_17` | Wool Camp Beanie | 22 | Apparel |
| `sku_18` | Collapsible Water Filter | 59 | Hydration |
| `sku_19` | Ultralight Tarp 2P | 135 | Shelter |
| `sku_20` | Fire Starter Kit | 15 | Accessories |

```sh
bunx prisma migrate dev --schema=packages/database/prisma/schema.prisma
bunx prisma db seed --schema=packages/database/prisma/schema.prisma
```

## API design

### GET /api/products

| | |
|---|---|
| Auth | **None** (public) |
| Query | None in v1 |

**200 OK** — array of products, sorted by `name` ascending.

```json
[
  {
    "id": "sku_1",
    "name": "Trail Runner Pack",
    "price": 89,
    "category": "Bags",
    "createdAt": "2026-06-04T12:00:00.000Z",
    "updatedAt": "2026-06-04T12:00:00.000Z"
  }
]
```

---

### GET /api/products/:id

| | |
|---|---|
| Auth | **None** (public) |
| Params | `id` — non-empty string |

**200 OK** — single product object.

**404 NOT_FOUND** — unknown id.

**400 VALIDATION_ERROR** — empty `:id` if validated.

### Response type

```ts
export type ProductResponse = {
  id: string;
  name: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};
```

Mirror as `Product` in `@repo/mfe-shared` (catalog fields only — omit timestamps in shared type if remotes do not need them; include if shell passes API shape as-is).

**Recommendation:** Shared `Product` = `{ id, name, price, category }` for UI; shell maps API response when passing to remote.

## Proposed file structure

```txt
packages/database/
  prisma/schema.prisma
  prisma/seed.ts
  prisma/migrations/<timestamp>_product_catalog/

packages/mfe-shared/src/
  types.ts                     # + Product, ProductsRemoteProps

apps/api/src/
  lib/products.ts
  routes/products.ts           # no authMiddleware
  app.ts

apps/shell/src/features/products-route/
  lib/
    products-api-client.ts     # fetchProducts()
  hooks/
    use-products.ts            # load + error state
  components/
    products-route-page.tsx    # fetch, pass props to remote

apps/mfe-products/src/features/catalog/
  types.ts                     # re-export Product from mfe-shared or delete
  hooks/use-product-search.ts  # require products arg (no mock default)
  components/products-page.tsx # ProductsRemoteProps
  lib/mock-products.ts         # delete after seed owns data

apps/api/tests/routes.test.ts
```

### Remote props contract

```ts
// packages/mfe-shared
export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type ProductsRemoteProps = RemoteSlotProps & {
  products: Product[];
};
```

Shell passes `ProductsRemoteProps` to `mfe_products/ProductsPage`. Update `apps/shell/src/remotes.d.ts` module declaration accordingly.

## Acceptance criteria

- [ ] Migration + seed: 20 products in DB; re-seed is idempotent
- [ ] `curl http://localhost:3001/api/products` returns 20 items **without** auth
- [ ] `curl http://localhost:3001/api/products/sku_1` returns 200; unknown id → 404
- [ ] `cd apps/api && bun test` and `typecheck` pass
- [ ] Signed-in user on shell `/products` sees 20 items from API (not mock)
- [ ] Client search still filters the loaded list
- [ ] API down / fetch error shows user-visible error (not silent mock fallback)
- [ ] `bun run build` passes for `shell`, `mfe-products`, `api`
- [ ] Spec checkboxes and `00-index.md` updated when complete

## Depends on

| Spec | Reason |
|------|--------|
| **11** API application | Express app, Prisma, error envelope |
| **04** Products catalog (MFE) | Existing catalog UI to wire |
| **07** Shell auth (soft) | `/products` route still auth-gated; sign-in needed for manual test but not for API |

## Implementation tasks

### T1 — Prisma model + migration

**Files:**

- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/migrations/<timestamp>_product_catalog/migration.sql`

**Verify:** migrate + generate succeed; empty `Product` table exists.

### T2 — Seed 20 products

**Files:**

- `packages/database/prisma/seed.ts`
- `packages/database/package.json` — prisma seed config

**Verify:** `bunx prisma db seed` → 20 rows; second run → still 20.

### T3 — Product lib + public routes

**Files:**

- `apps/api/src/lib/products.ts`
- `apps/api/src/routes/products.ts` — **no** `authMiddleware`
- `apps/api/src/app.ts`

**Verify:**

```sh
curl -s http://localhost:3001/api/products | jq length    # → 20
curl -s http://localhost:3001/api/products/sku_1 | jq .name
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/products/missing  # → 404
```

### T4 — API tests + api-design docs

**Files:**

- `apps/api/tests/routes.test.ts`
- `apps/docs/feature-specs/02-api-application/api-design.md`

**Verify:** `cd apps/api && bun test` green.

### T5 — Shared types

**Files:**

- `packages/mfe-shared/src/types.ts` — `Product`, `ProductsRemoteProps`
- `packages/mfe-shared/src/index.ts` — exports

**Verify:** `typecheck` in `mfe-shared`, `shell`, `mfe-products`.

### T6 — Shell fetch + pass props

**Files:**

- `apps/shell/src/features/products-route/lib/products-api-client.ts`
- `apps/shell/src/features/products-route/hooks/use-products.ts`
- `apps/shell/src/features/products-route/components/products-route-page.tsx`
- `apps/shell/src/remotes.d.ts`

**Verify:** `/products` loads 20 items when API is up; loading state while fetching.

### T7 — Remote consumes props

**Files:**

- `apps/mfe-products/src/features/catalog/components/products-page.tsx`
- `apps/mfe-products/src/features/catalog/hooks/use-product-search.ts`
- Remove `apps/mfe-products/src/features/catalog/lib/mock-products.ts`
- `apps/mfe-products/src/features/catalog/types.ts` — use shared `Product`

**Verify:** Search works on API data; no import of mock file remains.

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/12-api-product-catalog.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update task checkboxes and `00-index.md` if status changed; stop before T2 unless the user asks to continue.
