import type { User } from "@repo/mfe-shared";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { UserProvider } from "../../../context/user-context";
import { AuthSessionProvider } from "../context/auth-session-context";
import { ApiClientError, fetchMe, getApiBaseUrl } from "../lib/api-client";
import { isUnauthorizedError } from "../lib/is-unauthorized-error";
import { mapApiUserToMfeUser } from "../lib/map-api-user";

type LoadState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: User }
  | { status: "error"; message: string };

type Props = {
  children: ReactNode;
};

export function ApiUserProvider({ children }: Props) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const isBootstrappingRef = useRef(true);

  const loadUser = useCallback(async () => {
    const bootstrapping = isBootstrappingRef.current;
    if (bootstrapping) {
      setState({ status: "loading" });
    } else {
      setIsReloading(true);
    }

    try {
      const me = await fetchMe();
      setState({
        status: "authenticated",
        user: mapApiUserToMfeUser(me),
      });
    } catch (error) {
      if (isUnauthorizedError(error)) {
        setState({ status: "unauthenticated" });
        return;
      }

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
    } finally {
      isBootstrappingRef.current = false;
      setIsBootstrapping(false);
      setIsReloading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const sessionValue = useMemo(
    () => ({
      status: state.status,
      user: state.status === "authenticated" ? state.user : null,
      errorMessage: state.status === "error" ? state.message : null,
      isBootstrapping,
      isReloading,
      reloadUser: loadUser,
    }),
    [state, isBootstrapping, isReloading, loadUser]
  );

  if (isBootstrapping && state.status === "loading") {
    return (
      <AuthSessionProvider value={sessionValue}>
        <div className="text-muted-foreground flex min-h-svh items-center justify-center p-6 text-sm">
          Loading session…
        </div>
      </AuthSessionProvider>
    );
  }

  const content =
    state.status === "authenticated" ? (
      <UserProvider user={state.user}>{children}</UserProvider>
    ) : (
      children
    );

  return (
    <AuthSessionProvider value={sessionValue}>{content}</AuthSessionProvider>
  );
}
