import { type IRouter, Router } from "express";
import { z } from "zod";
import {
  clearSessionCookie,
  getSessionSecret,
  setSessionCookie,
} from "../lib/api-session.js";
import { sendError } from "../lib/errors.js";
import { verifyPassword } from "../lib/password.js";
import {
  createUserWithPassword,
  findUserByEmail,
  toUserResponse,
} from "../lib/users.js";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().min(1).max(120).optional(),
});

export const authRouter: IRouter = Router();

authRouter.post("/sign-up", async (req, res, next) => {
  try {
    if (!getSessionSecret()) {
      sendError(
        res,
        503,
        "INTERNAL_ERROR",
        "API session auth is not configured (set SESSION_SECRET)"
      );
      return;
    }

    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(
        res,
        400,
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message ?? "Invalid request body"
      );
      return;
    }

    const { email, password, name } = parsed.data;
    const existing = await findUserByEmail(email);
    if (existing) {
      sendError(res, 409, "CONFLICT", "An account with this email already exists");
      return;
    }

    const user = await createUserWithPassword({ email, password, name });
    setSessionCookie(res, user.id);
    res.status(201).json(toUserResponse(user));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/sign-in", async (req, res, next) => {
  try {
    if (!getSessionSecret()) {
      sendError(
        res,
        503,
        "INTERNAL_ERROR",
        "API session auth is not configured (set SESSION_SECRET)"
      );
      return;
    }

    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(
        res,
        400,
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message ?? "Invalid request body"
      );
      return;
    }

    const { email, password } = parsed.data;
    const user = await findUserByEmail(email);

    if (!user?.passwordHash) {
      sendError(res, 401, "UNAUTHORIZED", "Invalid email or password");
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      sendError(res, 401, "UNAUTHORIZED", "Invalid email or password");
      return;
    }

    setSessionCookie(res, user.id);
    res.json(toUserResponse(user));
  } catch (error) {
    next(error);
  }
});

authRouter.post("/sign-out", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).send();
});
