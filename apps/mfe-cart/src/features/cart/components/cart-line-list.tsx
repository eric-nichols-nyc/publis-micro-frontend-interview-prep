import type { CartLine } from "../types";
import { CartLineItem } from "./cart-line-item";

type CartLineListProps = {
  lines: CartLine[];
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
};

export function CartLineList({
  lines,
  onQuantityChange,
  onRemove,
}: CartLineListProps) {
  return (
    <ul className="cart-list">
      {lines.map((line) => (
        <CartLineItem
          key={line.id}
          line={line}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
