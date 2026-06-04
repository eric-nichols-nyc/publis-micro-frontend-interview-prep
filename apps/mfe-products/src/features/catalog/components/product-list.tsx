import type { Product } from "@repo/mfe-shared";
import { useState } from "react";

type ProductListProps = {
  products: Product[];
  onAddToCart?: (productId: string) => void;
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (productId: string) => void;
};

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <li className="product-card">
      <div className="product-card__media">
        {imageFailed ? (
          <div className="product-card__image-fallback" aria-hidden="true">
            No image
          </div>
        ) : (
          <img
            alt={product.name}
            className="product-card__image"
            height={60}
            loading="lazy"
            onError={() => setImageFailed(true)}
            src={product.imageUrl}
            width={80}
          />
        )}
      </div>
      <div className="product-card__info">
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__category">{product.category}</span>
      </div>
      <div className="product-card__footer">
        <strong className="product-card__price">${product.price}</strong>
        {onAddToCart ? (
          <button
            className="product-card__add"
            onClick={() => onAddToCart(product.id)}
            type="button"
          >
            Add to cart
          </button>
        ) : null}
      </div>
    </li>
  );
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <ul className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          onAddToCart={onAddToCart}
          product={product}
        />
      ))}
    </ul>
  );
}
