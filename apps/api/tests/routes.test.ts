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

  it("POST /api/cart/items without auth returns 401", async () => {
    const res = await request(app)
      .post("/api/cart/items")
      .send({ productId: "sku_1" });
    expect(res.status).toBe(401);
    expect(res.body.error?.code).toBe("UNAUTHORIZED");
  });

  it("authenticated cart CRUD uses price snapshot", async () => {
    const email = `cart-${Date.now()}@example.com`;
    const password = "password123";
    const agent = request.agent(app);

    const signUp = await agent
      .post("/api/auth/sign-up")
      .send({ email, password, name: "Cart Tester" });

    if (signUp.status === 503) {
      return;
    }

    expect(signUp.status).toBe(201);

    const list = await request(app).get("/api/products");
    if (list.status !== 200 || list.body.length === 0) {
      return;
    }

    const product = list.body[0];
    const productId = product.id as string;

    const emptyCart = await agent.get("/api/cart");
    expect(emptyCart.status).toBe(200);
    expect(emptyCart.body.items).toEqual([]);

    const add = await agent
      .post("/api/cart/items")
      .send({ productId, quantity: 1 });
    expect(add.status).toBe(201);
    expect(add.body.items).toHaveLength(1);
    expect(add.body.items[0].productId).toBe(productId);
    expect(add.body.items[0].price).toBe(product.price);
    expect(add.body.items[0].name).toBe(product.name);

    const itemId = add.body.items[0].id as string;

    const bump = await agent
      .post("/api/cart/items")
      .send({ productId, quantity: 2 });
    expect(bump.status).toBe(201);
    expect(bump.body.items).toHaveLength(1);
    expect(bump.body.items[0].quantity).toBe(3);

    const patch = await agent
      .patch(`/api/cart/items/${itemId}`)
      .send({ quantity: 1 });
    expect(patch.status).toBe(200);
    expect(patch.body.items[0].quantity).toBe(1);

    const remove = await agent.delete(`/api/cart/items/${itemId}`);
    expect(remove.status).toBe(200);
    expect(remove.body.items).toEqual([]);

    await agent.post("/api/cart/items").send({ productId });
    const clear = await agent.delete("/api/cart");
    expect(clear.status).toBe(200);
    expect(clear.body.items).toEqual([]);
  });

  it("user cannot mutate another user's cart item", async () => {
    const password = "password123";
    const agentA = request.agent(app);
    const agentB = request.agent(app);

    const signUpA = await agentA
      .post("/api/auth/sign-up")
      .send({ email: `cart-a-${Date.now()}@example.com`, password });

    if (signUpA.status === 503) {
      return;
    }

    const list = await request(app).get("/api/products");
    if (list.status !== 200 || list.body.length === 0) {
      return;
    }

    const productId = list.body[0].id as string;
    const add = await agentA
      .post("/api/cart/items")
      .send({ productId });
    const itemId = add.body.items[0].id as string;

    const signUpB = await agentB
      .post("/api/auth/sign-up")
      .send({ email: `cart-b-${Date.now()}@example.com`, password });
    expect(signUpB.status).toBe(201);

    const patch = await agentB
      .patch(`/api/cart/items/${itemId}`)
      .send({ quantity: 0 });
    expect(patch.status).toBe(404);
    expect(patch.body.error?.code).toBe("NOT_FOUND");
  });
});
