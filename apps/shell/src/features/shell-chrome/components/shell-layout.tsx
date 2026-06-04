import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Separator } from "@repo/design-system/components/ui/separator";
import { NavLink, Outlet } from "react-router-dom";
import { AuthNav } from "../../auth/components/auth-nav";
import { useCartSession } from "../../cart-session/components/cart-session-provider";

const navItems = [
  { end: true, label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Cart", to: "/cart" },
  { label: "Interview notes", to: "/interview" },
] as const;

export function ShellLayout() {
  const { itemCount } = useCartSession();

  return (
    <div className="bg-background text-foreground mx-auto min-h-svh max-w-4xl px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Module Federation demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Shop Shell</h1>
        </div>
        <AuthNav />
      </header>

      <Separator className="mb-6" />

      <nav aria-label="Main" className="mb-6 flex flex-wrap gap-2">
        {navItems.map(({ label, to, ...item }) => {
          const isCart = to === "/cart";
          const cartLabel =
            isCart && itemCount > 0 ? `${label} (${itemCount} items)` : label;

          return (
            <NavLink
              aria-label={isCart ? cartLabel : undefined}
              end={"end" in item ? item.end : undefined}
              key={to}
              to={to}
            >
              {({ isActive }) => (
                <Button
                  className="gap-1.5"
                  size="sm"
                  variant={isActive ? "secondary" : "ghost"}
                >
                  {label}
                  {isCart && itemCount > 0 ? (
                    <Badge aria-hidden="true" variant="secondary">
                      {itemCount}
                    </Badge>
                  ) : null}
                </Button>
              )}
            </NavLink>
          );
        })}
      </nav>

      <main className="min-h-80">
        <Outlet />
      </main>
    </div>
  );
}
