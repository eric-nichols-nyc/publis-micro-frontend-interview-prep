import type { ProductsRemoteProps } from "@repo/mfe-shared";
import { Suspense } from "react";
import { useUser } from "../../../context/user-context";
import { RemoteErrorBoundary } from "../../shell-core/components/remote-error-boundary";
import { loadRemote } from "../../shell-core/lib/load-remote";
import { useProducts } from "../hooks/use-products";

const ProductsPage = loadRemote<ProductsRemoteProps>(
  () => import("mfe_products/ProductsPage"),
  "Products"
);

export function ProductsRoutePage() {
  const user = useUser();
  const { status, products, errorMessage, reloadProducts } = useProducts();

  if (status === "loading") {
    return <p className="shell-loading">Loading catalog…</p>;
  }

  if (status === "error") {
    return (
      <div className="remote-fallback" role="alert">
        <h3>Could not load catalog</h3>
        <p>{errorMessage}</p>
        <button
          className="remote-fallback__retry"
          onClick={() => void reloadProducts()}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <RemoteErrorBoundary label="Products">
      <Suspense fallback={<p className="shell-loading">Loading products…</p>}>
        <ProductsPage products={products} user={user} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
