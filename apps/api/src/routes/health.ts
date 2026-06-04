import { type IRouter, Router } from "express";
import { env } from "../config/env.js";
import { database } from "../lib/db.js";

export const healthRouter: IRouter = Router();

healthRouter.get("/", async (_req, res) => {
  const started = Date.now();
  let dbStatus: "up" | "down" = "down";
  let latencyMs: number | null = null;

  try {
    await database.$queryRaw`SELECT 1`;
    latencyMs = Date.now() - started;
    dbStatus = "up";
  } catch {
    latencyMs = null;
    dbStatus = "down";
  }

  const strict = env().NODE_ENV === "production";
  const ok = dbStatus === "up";
  const status = ok ? "ok" : "degraded";

  res.status(strict && !ok ? 503 : 200).json({
    status,
    service: "api",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: dbStatus, latencyMs },
    },
  });
});
