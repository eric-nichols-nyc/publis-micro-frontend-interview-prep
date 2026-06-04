# API Application — Database Strategy

## Platform: Neon Postgres

- **Provider:** Neon serverless PostgreSQL (existing `@repo/database` setup).
- **Client:** Prisma 7 with `@prisma/adapter-neon` and `@neondatabase/serverless` (see `packages/database/index.ts`).
- **Connection:** `DATABASE_URL` from validated env; WebSocket constructor configured for Node (`ws`).

## Schema ownership

| Location | Owns |
|----------|------|
| `packages/database/prisma/schema.prisma` | All models and migrations |
| `apps/api` | Consumes client only—no schema forks |

### User model (baseline + extensions)

Current stub:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now())
}
```

**Required migration for API v1:**

| Field | Type | Purpose |
|-------|------|---------|
| `authUserId` | `String @unique` | Neon Auth subject — join key |
| `updatedAt` | `DateTime @updatedAt` | Profile sync |

Keep `role` as string in v1; migrate to enum when RBAC lands.

## Connection management

```txt
packages/database/index.ts
  → exports singleton `database` (PrismaClient)
  → dev: globalForPrisma hot-reload safe
apps/api/src/db/client.ts
  → re-export `database` for injection/testing
```

### Rules

1. **One Prisma client per process** — use package singleton.
2. **Serverless:** Rely on Neon pooler URL in production (`?sslmode=require`); document in `.env.example`.
3. **Graceful shutdown:** `main.ts` registers `SIGTERM` → `$disconnect()` (implementation task).
4. **Health check:** `HealthService` runs `SELECT 1` or `database.$queryRaw` with timeout.

## Repository pattern

### Interface (conceptual)

```ts
interface UserRepository {
  findByAuthId(authUserId: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  update(id: number, data: UpdateUserInput): Promise<User>;
}
```

### Implementation rules

- Lives in `apps/api/src/repositories/user.repository.ts`.
- Only layer that imports `Prisma` types from `@repo/database`.
- Maps to domain type in `src/types/domain/user.ts` (decouple HTTP from Prisma shape).
- Accept optional `tx` client:

```ts
type DbClient = typeof database | TransactionClient;
```

### Why repositories

- Testability: mock repositories in service unit tests.
- Query consolidation: one place for `include`, filters, pagination.
- Future read replicas: swap implementation without touching controllers.

## User provisioning

**Trigger:** First authenticated `GET /api/me` or `POST /api/users` when no row exists for `authUserId`.

```txt
UserService.getMe(authUserId, emailFromAuth)
  → repository.findByAuthId
  → if null: repository.create({ authUserId, email, name?, role: "user" })
  → return merged profile
```

| Env | Behavior |
|-----|----------|
| Development | Auto-provision enabled |
| Production | Auto-provision ON by default for this spec; flag `AUTO_PROVISION_USERS=false` to require explicit `POST /api/users` |

Use **transaction** if provisioning touches multiple tables (v1: single insert—transaction optional).

## Migrations

| Step | Owner | Command (from repo root) |
|------|-------|---------------------------|
| Author migration | `packages/database` | `bun run migrate` / `prisma migrate dev` |
| Deploy CI/prod | same package | `prisma migrate deploy` |
| Generate client | same | `prisma generate` |

API **must not** run `migrate deploy` on every boot in production (separate release step). Dev convenience script may chain migrate + seed.

## Seed data

**File:** `packages/database/prisma/seed.ts`

| Seed user | Purpose |
|-----------|---------|
| `dev@example.com` | Local shell sign-in match (if Neon Auth test user aligned) |
| Second user | Authorization tests (forbidden cross-user read) |

Seed ids should be stable (use `upsert` on `authUserId` or email).

```sh
# Document in apps/api/README
bun run migrate
bunx prisma db seed --schema=packages/database/prisma/schema.prisma
```

## Transaction strategy

### Helper: `withTransaction`

```txt
apps/api/src/db/transaction.ts
  withTransaction(async (tx) => {
    await userRepo.create(data, tx);
    await auditRepo.log(..., tx);
  });
```

### When to use

| Scenario | Transaction |
|----------|-------------|
| Single row insert/update | Optional |
| Multi-table invariant (order + line items) | Required |
| Read-only GET | No |

### Isolation

- Default Prisma level: Read Committed on Postgres.
- Retry on serialization failure: future enhancement for hot writes.

## Data access from API only

| Client | DB access |
|--------|-----------|
| Browser / shell / MFE | **Forbidden** |
| `apps/api` | **Allowed** via repositories |
| Scripts | Separate `packages/database` scripts only |

## Observability for DB

- Log slow queries > 500ms (dev warning).
- Health endpoint includes `database: { status, latencyMs }`.
- Do not log full SQL with PII in production.

## Future domains

When catalog/cart persist:

- New models in same Prisma schema.
- New repositories; **UserRepository** unchanged.
- Foreign keys: `userId` on owned resources for authorization checks.

## Related packages

- `@repo/types` — export `UserDto`, `MeResponse` matching repository output mapping.
- No Prisma types in shell—only DTOs from API responses.
