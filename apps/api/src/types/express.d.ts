import type { AuthenticatedUser } from "@repo/neon-auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
