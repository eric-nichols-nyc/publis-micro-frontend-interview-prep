import { createHmac, timingSafeEqual } from "node:crypto";
import type { Response } from "express";
import type { AuthenticatedUser } from "@repo/neon-auth";
import { findUserById } from "./users.js";

export const SESSION_COOKIE = "mfe_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

type SessionPayload = {
  uid: number;
  exp: number;
};

export const getSessionSecret = (): string | undefined => {
  const fromEnv = process.env.SESSION_SECRET?.trim();
  if (fromEnv && fromEnv.length >= 16) {
    return fromEnv;
  }

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return "dev-only-session-secret-min-16-chars";
  }

  return undefined;
};

const signPayload = (data: string, secret: string): string =>
  createHmac("sha256", secret).update(data).digest("base64url");

export const createSessionToken = (
  userId: number,
  secret: string
): string => {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${signPayload(data, secret)}`;
};

export const parseSessionToken = (
  token: string,
  secret: string
): SessionPayload | null => {
  const [data, signature] = token.split(".");
  if (!data || !signature) {
    return null;
  }

  const expected = signPayload(data, secret);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);

  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    ) as SessionPayload;

    if (
      typeof payload.uid !== "number" ||
      typeof payload.exp !== "number" ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const parseCookies = (
  header: string | undefined
): Record<string, string> => {
  if (!header) {
    return {};
  }

  return Object.fromEntries(
    header.split(";").map((part) => {
      const trimmed = part.trim();
      const eq = trimmed.indexOf("=");
      if (eq === -1) {
        return [trimmed, ""];
      }
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      return [key, decodeURIComponent(value)];
    })
  );
};

export const setSessionCookie = (res: Response, userId: number): void => {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("SESSION_SECRET is not configured");
  }

  const token = createSessionToken(userId, secret);
  const secure = process.env.NODE_ENV === "production";

  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}${secure ? "; Secure" : ""}`
  );
};

export const clearSessionCookie = (res: Response): void => {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
};

export const verifyApiSession = async (
  cookieHeader: string | undefined
): Promise<AuthenticatedUser | null> => {
  const secret = getSessionSecret();
  if (!secret) {
    return null;
  }

  const token = parseCookies(cookieHeader)[SESSION_COOKIE];
  if (!token) {
    return null;
  }

  const payload = parseSessionToken(token, secret);
  if (!payload) {
    return null;
  }

  const user = await findUserById(payload.uid);
  if (!user) {
    return null;
  }

  return {
    authUserId: user.authUserId,
    email: user.email,
    name: user.name,
    roles: [user.role],
  };
};
