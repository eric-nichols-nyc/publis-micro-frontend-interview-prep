import { database } from "./db.js";

export type ProductResponse = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export const findAllProducts = () =>
  database.product.findMany({
    orderBy: { name: "asc" },
  });

export const findProductById = (id: string) =>
  database.product.findUnique({
    where: { id },
  });

export const toProductResponse = (product: {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}): ProductResponse => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
  imageUrl: product.imageUrl,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString(),
});
