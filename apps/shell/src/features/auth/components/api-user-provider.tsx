import type { User } from "@repo/mfe-shared";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { UserProvider } from "../../../context/user-context";
import { ApiClientError, fetchMe, getApiBaseUrl } from "../lib/api-client";
import { isNeonAuthConfigured } from "../lib/neon-auth-client";
import { mapApiUserToMfeUser } from "../lib/map-api-user";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; user: User }
  | { status: "error"; message: string };

type Props = {
  children: ReactNode;
};

export function ApiUserProvider({ children }: Props) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const loadUser = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const me = await fetchMe();
      setState({ status: "ready", user: mapApiUserToMfeUser(me) });
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? `${error.code}: ${error.message}`
          : error instanceof Error
            ? error.message
            : "Failed to load user";

      console.error(
        `[shell] GET /api/me failed (${getApiBaseUrl()}).`,
        error
      );
      setState({ status: "error", message });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (state.status === "loading") {
    return (
      <div className="text-muted-foreground flex min-h-svh items-center justify-center p-6 text-sm">
        Loading session…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-md space-y-3 p-8 text-center">
        <p className="font-medium">Could not load your session</p>
        <p className="text-muted-foreground text-sm">{state.message}</p>
        <p className="text-muted-foreground text-xs">
          API: {getApiBaseUrl()}
          {isNeonAuthConfigured() ? " · Neon Auth configured" : ""}
        </p>
        <button
          className="text-primary text-sm underline"
          onClick={() => loadUser()}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  return <UserProvider user={state.user}>{children}</UserProvider>;
}
