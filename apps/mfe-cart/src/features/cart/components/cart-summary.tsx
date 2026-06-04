type CartSummaryProps = {
  subtotal: number;
};

export function CartSummary({ subtotal }: CartSummaryProps) {
  return (
    <p className="cart-total">
      <strong>Subtotal:</strong> ${subtotal}
    </p>
  );
}
