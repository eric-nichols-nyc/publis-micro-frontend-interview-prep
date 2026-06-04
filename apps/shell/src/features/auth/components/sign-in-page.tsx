import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Separator } from "@repo/design-system/components/ui/separator";
import { useAuthSession } from "../context/auth-session-context";
import { safeReturnPath, withReturnQuery } from "../lib/safe-return-path";
import { AuthCredentialsForm } from "./auth-credentials-form";
import { AuthPageGate } from "./auth-page-gate";

export function SignInPage() {
  const navigate = useNavigate();
  const { reloadUser } = useAuthSession();
  const [searchParams] = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("from"));

  const handleSuccess = async () => {
    await reloadUser();
    navigate(returnTo, { replace: true });
  };

  return (
    <AuthPageGate>
      <div className="bg-background mx-auto flex min-h-svh max-w-md flex-col justify-center px-6 py-8">
        <Card>
          <CardHeader className="space-y-2">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Shop Shell
            </p>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Sign in with your email and password. The shell loads your profile
              from the API and passes it to product and cart remotes.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AuthCredentialsForm mode="sign-in" onSuccess={handleSuccess} />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Separator />
            <p className="text-muted-foreground text-center text-sm">
              New here?{" "}
              <Link
                className="text-foreground font-medium underline"
                to={withReturnQuery("/sign-up", returnTo)}
              >
                Create an account
              </Link>
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link to={returnTo}>Back</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AuthPageGate>
  );
}
