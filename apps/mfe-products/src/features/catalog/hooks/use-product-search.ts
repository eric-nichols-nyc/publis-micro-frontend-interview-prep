import { useMemo, useState } from "react";
import { mockProducts } from "../lib/mock-products";
import type { Product } from "../types";

function filterByName(products: Product[], query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return products;
  }
  return products.filter((product) =>
    product.name.toLowerCase().includes(normalized)
  );
}

export function useProductSearch(products: Product[] = mockProducts) {
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(
    () => filterByName(products, query),
    [products, query]
  );

  return { query, setQuery, filteredProducts };
}
