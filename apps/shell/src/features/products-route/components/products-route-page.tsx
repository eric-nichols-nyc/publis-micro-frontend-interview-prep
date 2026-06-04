import { Suspense } from "react";
import { useUser } from "../../../context/user-context";
import { RemoteErrorBoundary } from "../../shell-core/components/remote-error-boundary";
import { loadRemote } from "../../shell-core/lib/load-remote";

const ProductsPage = loadRemote(
  () => import("mfe_products/ProductsPage"),
  "Products"
);

export function ProductsRoutePage() {
  const user = useUser();

  return (
    <RemoteErrorBoundary label="Products">
      <Suspense fallback={<p className="shell-loading">Loading products…</p>}>
        <ProductsPage user={user} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}
