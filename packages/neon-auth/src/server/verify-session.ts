import { neonAuthServerKeys } from "../keys.js";
import type { AuthenticatedUser, VerifySessionResult } from "../types.js";

type SessionPayload = {
  user?: {
    id?: string;
    email?: string;
    name?: string | null;
    role?: string;
  };
  session?: {
    id?: string;
  };
};

const devUser = (): AuthenticatedUser | null => {
  const keys = neonAuthServerKeys();
  if (!keys.isDevAuth || !keys.DEV_AUTH_USER_ID || !keys.DEV_AUTH_EMAIL) {
    return null;
  }

  return {
    authUserId: keys.DEV_AUTH_USER_ID,
    email: keys.DEV_AUTH_EMAIL,
    roles: ["user"],
    name: null,
  };
};

const mapSessionUser = (payload: SessionPayload): AuthenticatedUser | null => {
  const id = payload.user?.id;
  const email = payload.user?.email;

  if (!id || !email) {
    return null;
  }

  return {
    authUserId: id,
    email,
    name: payload.user?.name ?? null,
    sessionId: payload.session?.id,
    roles: payload.user?.role ? [payload.user.role] : ["user"],
  };
};

/**
 * Verify the incoming request session against Neon Auth (get-session) or dev env.
 */
export const verifySession = async (
  request: Request
): Promise<VerifySessionResult> => {
  const keys = neonAuthServerKeys();

  if (keys.isDevAuth) {
    const user = devUser();
    if (!user) {
      return { ok: false, code: "UNAUTHORIZED", message: "Dev auth misconfigured" };
    }
    return { ok: true, user };
  }

  if (!keys.isConfigured || !keys.NEON_AUTH_BASE_URL) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "Neon Auth is not configured on the server",
    };
  }

  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");

  if (!cookie && !authorization) {
    return { ok: false, code: "UNAUTHORIZED", message: "Missing credentials" };
  }

  const headers: Record<string, string> = {};
  if (cookie) {
    headers.cookie = cookie;
  }
  if (authorization) {
    headers.authorization = authorization;
  }

  const base = keys.NEON_AUTH_BASE_URL.replace(/\/$/, "");
  const sessionUrl = `${base}/get-session`;

  try {
    const response = await fetch(sessionUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        code: "UNAUTHORIZED",
        message: "Invalid or expired session",
      };
    }

    const body = (await response.json()) as { data?: SessionPayload };
    const user = mapSessionUser(body.data ?? {});

    if (!user) {
      return {
        ok: false,
        code: "UNAUTHORIZED",
        message: "Session has no user",
      };
    }

    return { ok: true, user };
  } catch {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "Could not verify session with Neon Auth",
    };
  }
};
