import type { Product } from "@repo/mfe-shared";
import { ApiClientError, getApiBaseUrl } from "../../auth/lib/api-client";

type ProductApiResponse = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

const toProduct = (product: ProductApiResponse): Product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
  imageUrl: product.imageUrl,
});

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${getApiBaseUrl()}/api/products`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    let code = "UNKNOWN";
    let message = response.statusText;
    try {
      const body = (await response.json()) as {
        error?: { code?: string; message?: string };
      };
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // ignore non-JSON body
    }
    throw new ApiClientError(response.status, code, message);
  }

  const data = (await response.json()) as ProductApiResponse[];
  return data.map(toProduct);
};
