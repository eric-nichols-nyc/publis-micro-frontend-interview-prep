import { ApiClientError } from "./api-client";

export const isUnauthorizedError = (error: unknown): boolean =>
  error instanceof ApiClientError &&
  (error.status === 401 || error.code === "UNAUTHORIZED");
