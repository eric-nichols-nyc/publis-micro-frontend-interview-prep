import type { Product } from "@repo/mfe-shared";
import { useMemo, useState } from "react";

function filterByName(products: Product[], query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return products;
  }
  return products.filter((product) =>
    product.name.toLowerCase().includes(normalized)
  );
}

export function useProductSearch(products: Product[]) {
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(
    () => filterByName(products, query),
    [products, query]
  );

  return { query, setQuery, filteredProducts };
}
