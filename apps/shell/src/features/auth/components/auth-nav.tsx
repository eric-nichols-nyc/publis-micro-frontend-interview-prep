import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { useAuthSession } from "../context/auth-session-context";
import { signOut } from "../lib/auth-api-client";

export function AuthNav() {
  const navigate = useNavigate();
  const { status, user, isBootstrapping, isReloading, reloadUser } =
    useAuthSession();

  const handleSignOut = async () => {
    await signOut();
    await reloadUser();
    navigate("/");
  };

  if (isBootstrapping) {
    return (
      <span className="text-muted-foreground text-sm">Checking session…</span>
    );
  }

  if (isReloading) {
    return (
      <span className="text-muted-foreground text-sm">Updating session…</span>
    );
  }

  if (status === "authenticated" && user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="text-sm" variant="secondary">
          Signed in as {user.name}
        </Badge>
        <Button
          onClick={() => void handleSignOut()}
          size="sm"
          variant="outline"
        >
          Sign out
        </Button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Session error</span>
        <Button onClick={() => void reloadUser()} size="sm" variant="outline">
          Retry
        </Button>
        <Button asChild size="sm" variant="default">
          <Link to="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link to="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link to="/sign-up">Create account</Link>
      </Button>
    </div>
  );
}
