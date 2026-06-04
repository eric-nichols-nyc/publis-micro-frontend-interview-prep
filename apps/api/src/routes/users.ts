import { type IRouter, Router } from "express";
import { z } from "zod";
import { authMiddleware, requireUser } from "../middleware/auth.js";
import { sendError } from "../lib/errors.js";
import {
  ensureUserProfile,
  findUserByAuthId,
  findUserById,
  toUserResponse,
} from "../lib/users.js";

export const usersRouter: IRouter = Router();

const idParamSchema = z.coerce.number().int().positive();

const createUserBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.never().optional(),
    role: z.never().optional(),
  })
  .strict();

usersRouter.use(authMiddleware, requireUser);

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params.id);
    if (!parsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid user id");
      return;
    }

    const current = req.user;
    if (!current) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const me = await ensureUserProfile({
      authUserId: current.authUserId,
      email: current.email,
      name: current.name,
    });

    if (parsed.data !== me.id) {
      sendError(res, 403, "FORBIDDEN", "You do not have access to this user");
      return;
    }

    const user = await findUserById(parsed.data);
    if (!user) {
      sendError(res, 404, "NOT_FOUND", "User not found");
      return;
    }

    res.json(toUserResponse(user));
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createUserBodySchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid request body");
      return;
    }

    const current = req.user;
    if (!current) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const before = await findUserByAuthId(current.authUserId);

    const user = await ensureUserProfile({
      authUserId: current.authUserId,
      email: current.email,
      name: parsed.data.name,
    });

    res.status(before ? 200 : 201).json(toUserResponse(user));
  } catch (error) {
    next(error);
  }
});
