import type { ProductsRemoteProps } from "@repo/mfe-shared";
import { useProductSearch } from "../hooks/use-product-search";
import { CatalogEmptyState } from "./catalog-empty-state";
import { ProductList } from "./product-list";
import { ProductSearch } from "./product-search";
import "../../../styles.css";

export function ProductsPage({
  user,
  products,
  onAddToCart,
}: ProductsRemoteProps) {
  const { query, setQuery, filteredProducts } = useProductSearch(products);
  const showEmpty = filteredProducts.length === 0;

  return (
    <section className="mfe-panel" data-remote="mfe-products">
      <header className="mfe-panel__header">
        <h2>Products</h2>
        <span className="mfe-panel__meta">Team: Catalog</span>
      </header>
      <p className="mfe-panel__user">Browsing as {user.name}</p>

      <ProductSearch
        query={query}
        onQueryChange={setQuery}
        resultCount={filteredProducts.length}
      />

      {showEmpty ? (
        <CatalogEmptyState query={query} />
      ) : (
        <ProductList onAddToCart={onAddToCart} products={filteredProducts} />
      )}
    </section>
  );
}

export default ProductsPage;
