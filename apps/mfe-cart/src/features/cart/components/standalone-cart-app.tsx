import { mockUser } from "@repo/mfe-shared";
import { useCart } from "../hooks/use-cart";
import { CartWidget } from "./cart-widget";

export function StandaloneCartApp() {
  const { lines, subtotal, updateQuantity, removeLine } = useCart();

  return (
    <CartWidget
      lines={lines}
      onRemoveLine={removeLine}
      onUpdateQuantity={updateQuantity}
      subtotal={subtotal}
      user={mockUser}
    />
  );
}
