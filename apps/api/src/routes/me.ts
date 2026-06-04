import { type IRouter, Router } from "express";
import { authMiddleware, requireUser } from "../middleware/auth.js";
import { sendError } from "../lib/errors.js";
import { ensureUserProfile, toUserResponse } from "../lib/users.js";

export const meRouter: IRouter = Router();

meRouter.get("/", authMiddleware, requireUser, async (req, res, next) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const user = await ensureUserProfile({
      authUserId: authUser.authUserId,
      email: authUser.email,
      name: authUser.name,
    });

    res.json(toUserResponse(user));
  } catch (error) {
    next(error);
  }
});
