import type { CartLine } from "../types";

export const initialCartLines: CartLine[] = [
  {
    id: "line_1",
    productId: "sku_1",
    name: "Trail Runner Pack",
    price: 89,
    quantity: 1,
  },
  {
    id: "line_2",
    productId: "sku_2",
    name: "Insulated Bottle",
    price: 24,
    quantity: 2,
  },
];
