import type { CartLine } from "@repo/mfe-shared";
import { ApiClientError, getApiBaseUrl } from "../../auth/lib/api-client";

type CartItemApiResponse = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartApiResponse = {
  id: string | null;
  items: CartItemApiResponse[];
};

const parseError = async (response: Response) => {
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
};

const toCartLine = (item: CartItemApiResponse): CartLine => ({
  id: item.id,
  productId: item.productId,
  name: item.name,
  price: item.price,
  quantity: item.quantity,
});

const mapCartResponse = (cart: CartApiResponse): CartLine[] =>
  cart.items.map(toCartLine);

const cartFetch = async (
  path: string,
  init?: RequestInit
): Promise<CartLine[]> => {
  const response = await fetch(`${getApiBaseUrl()}/api/cart${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    ...init,
  });

  if (!response.ok) {
    await parseError(response);
  }

  const cart = (await response.json()) as CartApiResponse;
  return mapCartResponse(cart);
};

export const fetchCart = () => cartFetch("");

export const addCartItem = (productId: string) =>
  cartFetch("/items", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

export const updateCartItemQuantity = (itemId: string, quantity: number) =>
  cartFetch(`/items/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (itemId: string) =>
  cartFetch(`/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });
