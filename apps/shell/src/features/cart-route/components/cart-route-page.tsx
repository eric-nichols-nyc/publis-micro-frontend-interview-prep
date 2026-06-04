import { Suspense } from "react";
import { useUser } from "../../../context/user-context";
import { RemoteErrorBoundary } from "../../shell-core/components/remote-error-boundary";
import { loadRemote } from "../../shell-core/lib/load-remote";

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
