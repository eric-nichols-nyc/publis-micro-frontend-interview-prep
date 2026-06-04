import type { NextFunction, Request, Response } from "express";
import { HttpError, sendError } from "../lib/errors.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError) {
    sendError(res, err.status, err.code, err.message);
    return;
  }

  console.error(err);
  sendError(res, 500, "INTERNAL_ERROR", "Internal server error");
};
