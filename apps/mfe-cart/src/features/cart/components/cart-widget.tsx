import type { CartRemoteProps } from "@repo/mfe-shared";
import { CartEmptyState } from "./cart-empty-state";
import { CartLineList } from "./cart-line-list";
import { CartSummary } from "./cart-summary";
import "../../../styles.css";

export function CartWidget({
  user,
  lines,
  subtotal,
  onUpdateQuantity,
  onRemoveLine,
}: CartRemoteProps) {
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
            onQuantityChange={onUpdateQuantity}
            onRemove={onRemoveLine}
          />
          <CartSummary subtotal={subtotal} />
        </>
      )}
    </section>
  );
}

export default CartWidget;
