import type { AuthenticatedUser } from "@repo/neon-auth";
import { verifySession } from "@repo/neon-auth/server";
import type { NextFunction, Request, Response } from "express";
import { sendError } from "../lib/errors.js";

const toFetchRequest = (req: Request) =>
  new Request(`http://localhost${req.originalUrl}`, {
    method: req.method,
    headers: {
      ...(req.headers.cookie ? { cookie: req.headers.cookie } : {}),
      ...(req.headers.authorization
        ? { authorization: req.headers.authorization }
        : {}),
    },
  });

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await verifySession(toFetchRequest(req));

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
