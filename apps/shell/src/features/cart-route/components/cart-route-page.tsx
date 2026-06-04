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
  const {
    lines,
    subtotal,
    updateQuantity,
    removeLine,
    cartStatus,
    cartErrorMessage,
    reloadCart,
  } = useCartSession();

  if (cartStatus === "loading") {
    return <p className="shell-loading">Loading cart…</p>;
  }

  if (cartStatus === "error") {
    return (
      <div className="remote-fallback" role="alert">
        <h3>Could not load cart</h3>
        <p>{cartErrorMessage}</p>
        <button
          className="remote-fallback__retry"
          onClick={() => void reloadCart()}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RemoteErrorBoundary label="Cart">
      <Suspense fallback={<p className="shell-loading">Loading cart…</p>}>
        <CartWidget
          lines={lines}
          onRemoveLine={(lineId) => void removeLine(lineId)}
          onUpdateQuantity={(lineId, quantity) =>
            void updateQuantity(lineId, quantity)
          }
          subtotal={subtotal}
          user={user}
        />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
