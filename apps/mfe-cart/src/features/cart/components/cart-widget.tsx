import type { RemoteSlotProps } from "@repo/mfe-shared";
import { useCart } from "../hooks/use-cart";
import { CartEmptyState } from "./cart-empty-state";
import { CartLineList } from "./cart-line-list";
import { CartSummary } from "./cart-summary";
import "../../../styles.css";

export function CartWidget({ user }: RemoteSlotProps) {
  const { lines, subtotal, updateQuantity, removeLine } = useCart();
  const isEmpty = lines.length === 0;

  return (
    <section className="mfe-panel" data-remote="mfe-cart">
      <header className="mfe-panel__header">
        <h2>Cart</h2>
        <span className="mfe-panel__meta">Team: Checkout</span>
      </header>
      <p className="mfe-panel__user">Cart for {user.email}</p>

      {isEmpty ? (
        <CartEmptyState />
      ) : (
        <>
          <CartLineList
            lines={lines}
            onQuantityChange={updateQuantity}
            onRemove={removeLine}
          />
          <CartSummary subtotal={subtotal} />
        </>
      )}
    </section>
  );
}

export default CartWidget;
