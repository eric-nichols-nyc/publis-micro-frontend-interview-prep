import type { Product } from "@repo/mfe-shared";
import { useCallback, useEffect, useState } from "react";
import { ApiClientError } from "../../auth/lib/api-client";
import { fetchProducts } from "../lib/products-api-client";

type UseProductsState =
  | { status: "loading"; products: Product[]; errorMessage: null }
  | { status: "success"; products: Product[]; errorMessage: null }
  | { status: "error"; products: Product[]; errorMessage: string };

export function useProducts() {
  const [state, setState] = useState<UseProductsState>({
    status: "loading",
    products: [],
    errorMessage: null,
  });

  const loadProducts = useCallback(async () => {
    setState({ status: "loading", products: [], errorMessage: null });

    try {
      const products = await fetchProducts();
      setState({ status: "success", products, errorMessage: null });
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? `${error.code}: ${error.message}`
          : error instanceof Error
            ? error.message
            : "Failed to load products";

      setState({ status: "error", products: [], errorMessage: message });
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return { ...state, reloadProducts: loadProducts };
}
