import type { Product } from "@repo/mfe-shared";
import { mockUser } from "@repo/mfe-shared";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@repo/mfe-shared/tokens.css";
import "./styles.css";
import { ProductsPage } from "./products-page";

const defaultApiBaseUrl = "http://localhost:3001";

const fetchStandaloneProducts = async (): Promise<Product[]> => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? defaultApiBaseUrl;
  const response = await fetch(`${baseUrl}/api/products`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`);
  }

  const data = (await response.json()) as Product[];
  return data.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
  }));
};

function StandaloneProductsApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStandaloneProducts()
      .then(setProducts)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      });
  }, []);

  if (error) {
    return <p className="remote-standalone__banner">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="remote-standalone__banner">Loading catalog…</p>;
  }

  return (
    <ProductsPage
      onAddToCart={() => {}}
      products={products}
      user={mockUser}
    />
  );
}

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <div className="remote-standalone">
        <p className="remote-standalone__banner">
          Standalone dev mode — normally loaded by the shell.
        </p>
        <StandaloneProductsApp />
      </div>
    </StrictMode>
  );
}
