import type { AuthenticatedUser } from "@repo/neon-auth";
import type { NextFunction, Request, Response } from "express";
import { sendError } from "../lib/errors.js";
import { getRequestUser } from "../lib/get-request-user.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await getRequestUser(req);

  if (!result.ok) {
    sendError(res, 401, "UNAUTHORIZED", result.message);
    return;
  }

  req.user = result.user;
  next();
};

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    sendError(res, 401, "UNAUTHORIZED", "Authentication required");
    return;
  }
  next();
};

export type { AuthenticatedUser };
