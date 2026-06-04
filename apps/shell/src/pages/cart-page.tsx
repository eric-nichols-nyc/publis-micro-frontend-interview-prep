import { Suspense } from "react";
import { RemoteErrorBoundary } from "../components/remote-error-boundary";
import { useUser } from "../context/user-context";
import { loadRemote } from "../lib/load-remote";

const CartWidget = loadRemote(
  () => import("mfe_cart/CartWidget"),
  "Cart"
);

export function CartRoutePage() {
  const user = useUser();

  return (
    <RemoteErrorBoundary label="Cart">
      <Suspense fallback={<p className="shell-loading">Loading cart…</p>}>
        <CartWidget user={user} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
