import { Suspense } from "react";
import { useUser } from "../../../context/user-context";
import { useCartSession } from "../../cart-session/components/cart-session-provider";
import { RemoteErrorBoundary } from "../../shell-core/components/remote-error-boundary";
import { loadRemote } from "../../shell-core/lib/load-remote";

const CartWidget = loadRemote(
  () => import("mfe_cart/CartWidget"),
  "Cart"
);

export function CartRoutePage() {
  const user = useUser();
  const { lines, subtotal, updateQuantity, removeLine } = useCartSession();

  return (
    <RemoteErrorBoundary label="Cart">
      <Suspense fallback={<p className="shell-loading">Loading cart…</p>}>
        <CartWidget
          lines={lines}
          onRemoveLine={removeLine}
          onUpdateQuantity={updateQuantity}
          subtotal={subtotal}
          user={user}
        />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
