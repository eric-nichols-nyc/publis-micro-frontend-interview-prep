import { NavLink, Outlet } from "react-router-dom";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Separator } from "@repo/design-system/components/ui/separator";
import { useUser } from "../../../context/user-context";

const navItems = [
  { end: true, label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Cart", to: "/cart" },
  { label: "Interview notes", to: "/interview" },
] as const;

export function ShellLayout() {
  const user = useUser();

  return (
    <div className="bg-background text-foreground mx-auto min-h-svh max-w-4xl px-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            Module Federation demo
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Shop Shell</h1>
        </div>
        <Badge className="text-sm" variant="secondary">
          Signed in as {user.name}
        </Badge>
      </header>

      <Separator className="mb-6" />

      <nav aria-label="Main" className="mb-6 flex flex-wrap gap-2">
        {navItems.map(({ label, to, ...item }) => (
          <NavLink end={"end" in item ? item.end : undefined} key={to} to={to}>
            {({ isActive }) => (
              <Button size="sm" variant={isActive ? "secondary" : "ghost"}>
                {label}
              </Button>
            )}
          </NavLink>
        ))}
      </nav>

      <main className="min-h-80">
        <Outlet />
      </main>
    </div>
  );
}
