import type { CartLine } from "../types";

type CartLineItemProps = {
  line: CartLine;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
};

export function CartLineItem({
  line,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = line.price * line.quantity;

  return (
    <li className="cart-line">
      <div className="cart-line__details">
        <span className="cart-line__name">{line.name}</span>
        <span className="cart-line__unit">${line.price} each</span>
      </div>

      <div className="cart-line__actions">
        <div className="cart-qty" aria-label={`Quantity for ${line.name}`}>
          <button
            type="button"
            className="cart-qty__btn"
            aria-label={`Decrease quantity of ${line.name}`}
            onClick={() => onQuantityChange(line.id, line.quantity - 1)}
          >
            −
          </button>
          <span className="cart-qty__value">{line.quantity}</span>
          <button
            type="button"
            className="cart-qty__btn"
            aria-label={`Increase quantity of ${line.name}`}
            onClick={() => onQuantityChange(line.id, line.quantity + 1)}
          >
            +
          </button>
        </div>

        <strong className="cart-line__total">${lineTotal}</strong>

        <button
          type="button"
          className="cart-line__remove"
          onClick={() => onRemove(line.id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
