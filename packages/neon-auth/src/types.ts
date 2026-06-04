export type AuthenticatedUser = {
  authUserId: string;
  email: string;
  sessionId?: string;
  roles: string[];
  name?: string | null;
};

export type VerifySessionResult =
  | { ok: true; user: AuthenticatedUser }
  | { ok: false; code: "UNAUTHORIZED"; message: string };
