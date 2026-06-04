declare module "mfe_products/ProductsPage" {
  import type { ComponentType } from "react";
  import type { RemoteSlotProps } from "@repo/mfe-shared";

  const ProductsPage: ComponentType<RemoteSlotProps>;
  export default ProductsPage;
}

declare module "mfe_cart/CartWidget" {
  import type { ComponentType } from "react";
  import type { RemoteSlotProps } from "@repo/mfe-shared";

  const CartWidget: ComponentType<RemoteSlotProps>;
  export default CartWidget;
}
