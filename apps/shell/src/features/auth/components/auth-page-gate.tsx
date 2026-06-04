import { Navigate, useSearchParams } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthSession } from "../context/auth-session-context";
import { safeReturnPath } from "../lib/safe-return-path";

type Props = {
  children: ReactNode;
};

/** Redirects signed-in users away from sign-in / sign-up. */
export function AuthPageGate({ children }: Props) {
  const { status, isBootstrapping } = useAuthSession();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("from"));

  if (isBootstrapping) {
    return (
      <p className="text-muted-foreground flex min-h-svh items-center justify-center text-sm">
        Checking session…
      </p>
    );
  }

  if (status === "authenticated") {
    return <Navigate replace to={returnTo} />;
  }

  return children;
}
