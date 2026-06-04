import type { RemoteSlotProps } from "@repo/mfe-shared";
import "./styles.css";

const products = [
  { id: "sku_1", name: "Trail Runner Pack", price: 89 },
  { id: "sku_2", name: "Insulated Bottle", price: 24 },
  { id: "sku_3", name: "Merino Base Layer", price: 65 },
];

export function ProductsPage({ user }: RemoteSlotProps) {
  return (
    <section className="mfe-panel" data-remote="mfe-products">
      <header className="mfe-panel__header">
        <h2>Products</h2>
        <span className="mfe-panel__meta">Team: Catalog</span>
      </header>
      <p className="mfe-panel__user">Browsing as {user.name}</p>
      <ul className="product-list">
        {products.map((product) => (
          <li className="product-card" key={product.id}>
            <span>{product.name}</span>
            <strong>${product.price}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProductsPage;
