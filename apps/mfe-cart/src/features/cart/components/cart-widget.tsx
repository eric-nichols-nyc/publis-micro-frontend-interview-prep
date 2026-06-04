import type { RemoteSlotProps } from "@repo/mfe-shared";
import "../../../styles.css";

const cartItems = [
  { id: "line_1", name: "Trail Runner Pack", qty: 1 },
  { id: "line_2", name: "Insulated Bottle", qty: 2 },
];

export function CartWidget({ user }: RemoteSlotProps) {
  return (
    <section className="mfe-panel" data-remote="mfe-cart">
      <header className="mfe-panel__header">
        <h2>Cart</h2>
        <span className="mfe-panel__meta">Team: Checkout</span>
      </header>
      <p className="mfe-panel__user">Cart for {user.email}</p>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li className="cart-line" key={item.id}>
            <span>
              {item.name} × {item.qty}
            </span>
          </li>
        ))}
      </ul>
      <p className="cart-total">
        <strong>Subtotal:</strong> $137
      </p>
    </section>
  );
}

export default CartWidget;
