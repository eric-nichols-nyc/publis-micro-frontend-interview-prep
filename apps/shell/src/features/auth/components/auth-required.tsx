import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "@repo/design-system/components/ui/button";
import { useAuthSession } from "../context/auth-session-context";

type Props = {
  children: React.ReactNode;
};

export function AuthRequired({ children }: Props) {
  const { status, errorMessage, reloadUser } = useAuthSession();
  const location = useLocation();

  if (status === "loading") {
    return (
      <p className="text-muted-foreground text-sm">Loading session…</p>
    );
  }

  if (status === "unauthenticated") {
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate replace to={`/sign-in?from=${from}`} />;
  }

  if (status === "error") {
    return (
      <div className="space-y-3 rounded-lg border p-6 text-center">
        <p className="font-medium">Could not verify your session</p>
        <p className="text-muted-foreground text-sm">{errorMessage}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={() => reloadUser()} size="sm" type="button">
            Retry
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
