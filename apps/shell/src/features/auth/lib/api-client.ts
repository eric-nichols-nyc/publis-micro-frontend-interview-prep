import type { ApiErrorBody, MeResponse } from "./api-types";

const defaultBaseUrl = "http://localhost:3001";

export const getApiBaseUrl = (): string => {
  const url =
    import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL;
  return url?.replace(/\/$/, "") ?? defaultBaseUrl;
};

export class ApiClientError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export const fetchMe = async (): Promise<MeResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/api/me`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    let code = "UNKNOWN";
    let message = response.statusText;
    try {
      const body = (await response.json()) as ApiErrorBody;
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // ignore non-JSON body
    }
    throw new ApiClientError(response.status, code, message);
  }

  return response.json() as Promise<MeResponse>;
};
