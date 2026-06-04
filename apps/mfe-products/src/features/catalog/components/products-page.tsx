import type { RemoteSlotProps } from "@repo/mfe-shared";
import { useEffect, useState } from "react";
import { useProductSearch } from "../hooks/use-product-search";
import { CatalogEmptyState } from "./catalog-empty-state";
import { ProductList } from "./product-list";
import { ProductListSkeleton } from "./product-list-skeleton";
import { ProductSearch } from "./product-search";
import "../../../styles.css";

const CATALOG_LOAD_DELAY_MS = 400;

export function ProductsPage({ user }: RemoteSlotProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { query, setQuery, filteredProducts } = useProductSearch();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), CATALOG_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const showEmpty = !isLoading && filteredProducts.length === 0;

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
        resultCount={isLoading ? 0 : filteredProducts.length}
      />

      {isLoading ? (
        <ProductListSkeleton />
      ) : showEmpty ? (
        <CatalogEmptyState query={query} />
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </section>
  );
}

export default ProductsPage;
