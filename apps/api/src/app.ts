import express, { type Express } from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { meRouter } from "./routes/me.js";
import { usersRouter } from "./routes/users.js";

export const createApp = (): Express => {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/me", meRouter);
  app.use("/api/users", usersRouter);

  app.use(errorHandler);

  return app;
};
