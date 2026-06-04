export function CartEmptyState() {
  return (
    <div className="cart-empty" role="status">
      <p className="cart-empty__title">Your cart is empty</p>
      <p className="cart-empty__hint">Add items from the catalog to see them here.</p>
    </div>
  );
}
