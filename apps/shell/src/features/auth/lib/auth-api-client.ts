import type { MeResponse } from "./api-types";
import { ApiClientError, getApiBaseUrl } from "./api-client";

type Credentials = {
  email: string;
  password: string;
  name?: string;
};

const postAuth = async (
  path: "sign-up" | "sign-in",
  body: Credentials
): Promise<MeResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let code = "UNKNOWN";
    let message = response.statusText;
    try {
      const payload = (await response.json()) as {
        error?: { code?: string; message?: string };
      };
      code = payload.error?.code ?? code;
      message = payload.error?.message ?? message;
    } catch {
      // ignore non-JSON body
    }
    throw new ApiClientError(response.status, code, message);
  }

  return response.json() as Promise<MeResponse>;
};

export const signUp = (credentials: Credentials) =>
  postAuth("sign-up", credentials);

export const signIn = (credentials: Credentials) =>
  postAuth("sign-in", credentials);

export const signOut = async (): Promise<void> => {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/sign-out`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok && response.status !== 204) {
    throw new ApiClientError(
      response.status,
      "UNKNOWN",
      response.statusText || "Sign out failed"
    );
  }
};
