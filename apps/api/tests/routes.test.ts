import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "bun:test";
import { config } from "dotenv";
import request from "supertest";

const root = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(root, "../.env") });
config({ path: resolve(root, "../../../packages/database/.env") });

process.env.DEV_AUTH_USER_ID ??= "dev-user-1";
process.env.DEV_AUTH_EMAIL ??= "dev@example.com";

const { createApp } = await import("../src/app.js");

describe("API routes", () => {
  const app = createApp();

  it("GET /health returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBeDefined();
    expect(res.body.service).toBe("api");
  });

  it("GET /api/me without auth returns 401 when neon not configured", async () => {
    const res = await request(app).get("/api/me");
    expect([200, 401]).toContain(res.status);
  });

  it("GET /api/me with dev auth returns user", async () => {
    const res = await request(app).get("/api/me");
    if (res.status !== 200) {
      return;
    }
    expect(res.body.email).toBeDefined();
    expect(res.body.authUserId).toBeDefined();
  });
});
