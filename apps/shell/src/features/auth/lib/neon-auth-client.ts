import {
  BetterAuthReactAdapter,
  createAuthClient,
} from "@repo/neon-auth/client";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL as string | undefined;

export const isNeonAuthConfigured = (): boolean => Boolean(authUrl);

/** For sign-in UI (spec 07). Cookies flow to API via `credentials: 'include'`. */
export const getNeonAuthClient = (): unknown => {
  if (!authUrl) {
    return null;
  }

  return createAuthClient(authUrl, {
    adapter: BetterAuthReactAdapter(),
  });
};
