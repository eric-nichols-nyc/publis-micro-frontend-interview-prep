import type { Response } from "express";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export const sendError = (
  res: Response,
  status: number,
  code: ApiErrorCode,
  message: string
) => {
  res.status(status).json({
    error: { code, message },
  });
};

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}
