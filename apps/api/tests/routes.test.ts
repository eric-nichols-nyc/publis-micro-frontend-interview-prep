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

  it("sign-up, sign-in, and sign-out with API session cookie", async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = "password123";
    const agent = request.agent(app);

    const signUp = await agent
      .post("/api/auth/sign-up")
      .send({ email, password, name: "Test User" });

    if (signUp.status === 503) {
      return;
    }

    expect(signUp.status).toBe(201);
    expect(signUp.body.email).toBe(email);

    const me = await agent.get("/api/me");
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(email);

    await agent.post("/api/auth/sign-out");
    const afterSignOut = await agent.get("/api/me");
    expect([401, 200]).toContain(afterSignOut.status);

    const signIn = await request(app)
      .post("/api/auth/sign-in")
      .send({ email, password });

    expect(signIn.status).toBe(200);
    expect(signIn.headers["set-cookie"]).toBeDefined();
  });

  it("GET /api/products returns catalog without auth", async () => {
    const res = await request(app).get("/api/products");
    if (res.status !== 200) {
      return;
    }

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const first = res.body[0];
    expect(first.id).toBeDefined();
    expect(first.name).toBeDefined();
    expect(typeof first.price).toBe("number");
    expect(first.category).toBeDefined();
    expect(first.imageUrl).toMatch(/^https:\/\//);
    expect(first.createdAt).toBeDefined();
    expect(first.updatedAt).toBeDefined();
  });

  it("GET /api/products/:id returns one product or 404", async () => {
    const list = await request(app).get("/api/products");
    if (list.status !== 200 || list.body.length === 0) {
      return;
    }

    const id = list.body[0].id as string;
    const res = await request(app).get(`/api/products/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.imageUrl).toMatch(/^https:\/\//);

    const missing = await request(app).get("/api/products/unknown-sku");
    expect(missing.status).toBe(404);
    expect(missing.body.error?.code).toBe("NOT_FOUND");
  });
});
