# API (minimal Express)

Backend for the MFE demo: health, session-backed `/api/me`, user routes.

## Dev

```sh
# From repo root — ensure packages/database/.env has DATABASE_URL
cp apps/api/.env.example apps/api/.env

bun install
bun run migrate          # User table + authUserId
cd packages/database && bunx prisma db seed

cd apps/api && bun run dev
```

Default dev auth (no Neon Auth project):

```env
DEV_AUTH_USER_ID=dev-user-1
DEV_AUTH_EMAIL=dev@example.com
```

## Quick checks

```sh
curl http://localhost:3001/health
curl http://localhost:3001/api/me          # 200 with dev auth env set
```

With dev auth, requests succeed without cookies when `DEV_AUTH_*` is set and Neon Auth is not configured.

## Stack

- Express + `@repo/neon-auth` + `@repo/database`
- Flat layout: `routes/`, `middleware/`, `lib/`

See [apps/docs/feature-specs/02-api-application/](../docs/feature-specs/02-api-application/).
