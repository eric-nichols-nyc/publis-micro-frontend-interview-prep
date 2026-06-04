import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prisma v7 does not load .env automatically; load from this package root
// so CLI works regardless of cwd (e.g. apps/studio with --config).
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
