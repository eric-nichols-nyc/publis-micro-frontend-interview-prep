declare module "mfe_products/ProductsPage" {
  import type { ComponentType } from "react";
  import type { ProductsRemoteProps } from "@repo/mfe-shared";

  const ProductsPage: ComponentType<ProductsRemoteProps>;
  export default ProductsPage;
}

declare module "mfe_cart/CartWidget" {
  import type { ComponentType } from "react";
  import type { CartRemoteProps } from "@repo/mfe-shared";

  const CartWidget: ComponentType<CartRemoteProps>;
  export default CartWidget;
}
