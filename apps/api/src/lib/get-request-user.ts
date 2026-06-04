import type { VerifySessionResult } from "@repo/neon-auth";
import { verifySession } from "@repo/neon-auth/server";
import type { Request } from "express";
import { verifyApiSession } from "./api-session.js";

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

/** API cookie session first, then Neon / dev auth. */
export const getRequestUser = async (
  req: Request
): Promise<VerifySessionResult> => {
  const apiUser = await verifyApiSession(req.headers.cookie);
  if (apiUser) {
    return { ok: true, user: apiUser };
  }

  return verifySession(toFetchRequest(req));
};
