import { Link } from "react-router-dom";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

const routes = [
  {
    description: "Lazy-loads the catalog remote (mfe_products).",
    path: "/products",
    title: "Products",
  },
  {
    description: "Lazy-loads the cart remote (mfe_cart).",
    path: "/cart",
    title: "Cart",
  },
] as const;

export function HomePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shell (host application)</CardTitle>
          <CardDescription>
            Routing, navigation, and auth context live here. Product and cart
            domains are loaded as federated remotes on their routes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-relaxed">
            <li>
              <strong className="text-foreground">Shared React</strong> —
              singleton via Module Federation
            </li>
            <li>
              <strong className="text-foreground">Design system</strong> —
              shell chrome uses <code>@repo/design-system</code>
            </li>
          </ul>
          <p className="text-muted-foreground border-primary/30 border-l-2 pl-3 text-sm">
            To demo failure handling: stop the cart remote dev server and open{" "}
            <code>/cart</code>.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {routes.map(({ description, path, title }) => (
          <Card key={path}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild size="sm">
                <Link to={path}>Open {title.toLowerCase()}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
