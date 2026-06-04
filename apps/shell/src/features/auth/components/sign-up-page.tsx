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

export function SignUpPage() {
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
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Register with email and password. Your shop profile is created
              immediately in the API database.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AuthCredentialsForm mode="sign-up" onSuccess={handleSuccess} />
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Separator />
            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                className="text-foreground font-medium underline"
                to={withReturnQuery("/sign-in", returnTo)}
              >
                Sign in
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
