import type { Product } from "../types";

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <ul className="product-list">
      {products.map((product) => (
        <li className="product-card" key={product.id}>
          <div className="product-card__info">
            <span className="product-card__name">{product.name}</span>
            <span className="product-card__category">{product.category}</span>
          </div>
          <strong className="product-card__price">${product.price}</strong>
        </li>
      ))}
    </ul>
  );
}
