import type { AuthenticatedUser } from "@repo/neon-auth";
import { database } from "./db.js";
import { HttpError } from "./errors.js";
import { findProductById } from "./products.js";
import { ensureUserProfile } from "./users.js";

export type CartItemResponse = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartResponse = {
  id: string | null;
  items: CartItemResponse[];
};

const ACTIVE_STATUS = "active";

const cartWithItemsInclude = {
  items: {
    orderBy: { createdAt: "asc" as const },
  },
} as const;

export const resolveDbUserFromAuth = (authUser: AuthenticatedUser) =>
  ensureUserProfile({
    authUserId: authUser.authUserId,
    email: authUser.email,
    name: authUser.name,
  });

export const findActiveCart = (userId: number) =>
  database.cart.findUnique({
    where: {
      userId_status: { userId, status: ACTIVE_STATUS },
    },
    include: cartWithItemsInclude,
  });

export const getOrCreateActiveCart = async (userId: number) => {
  const existing = await findActiveCart(userId);
  if (existing) {
    return existing;
  }

  return database.cart.create({
    data: {
      userId,
      status: ACTIVE_STATUS,
    },
    include: cartWithItemsInclude,
  });
};

const toCartItemResponse = (item: {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot: number;
  nameSnapshot: string | null;
}): CartItemResponse => ({
  id: item.id,
  productId: item.productId,
  name: item.nameSnapshot ?? item.productId,
  price: item.priceSnapshot,
  quantity: item.quantity,
});

type CartItemRow = {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot: number;
  nameSnapshot: string | null;
};

export const toCartResponse = (
  cart: { id: string; items: CartItemRow[] } | null
): CartResponse => {
  if (!cart) {
    return { id: null, items: [] };
  }

  return {
    id: cart.id,
    items: cart.items.map(toCartItemResponse),
  };
};

export const getActiveCartForUser = async (userId: number): Promise<CartResponse> => {
  const cart = await findActiveCart(userId);
  return toCartResponse(cart);
};

export const addCartItem = async (
  userId: number,
  productId: string,
  quantity: number
): Promise<CartResponse> => {
  const product = await findProductById(productId);
  if (!product) {
    throw new HttpError(404, "NOT_FOUND", "Product not found");
  }

  const cart = await getOrCreateActiveCart(userId);
  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    await database.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await database.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        priceSnapshot: product.price,
        nameSnapshot: product.name,
      },
    });
  }

  const updated = await findActiveCart(userId);
  return toCartResponse(updated);
};

const findCartItemForUser = async (userId: number, itemId: string) => {
  const item = await database.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId || item.cart.status !== ACTIVE_STATUS) {
    return null;
  }

  return item;
};

export const updateCartItemQuantity = async (
  userId: number,
  itemId: string,
  quantity: number
): Promise<CartResponse> => {
  const item = await findCartItemForUser(userId, itemId);
  if (!item) {
    throw new HttpError(404, "NOT_FOUND", "Cart item not found");
  }

  if (quantity <= 0) {
    await database.cartItem.delete({ where: { id: itemId } });
  } else {
    await database.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return getActiveCartForUser(userId);
};

export const removeCartItem = async (
  userId: number,
  itemId: string
): Promise<CartResponse> => {
  const item = await findCartItemForUser(userId, itemId);
  if (!item) {
    throw new HttpError(404, "NOT_FOUND", "Cart item not found");
  }

  await database.cartItem.delete({ where: { id: itemId } });
  return getActiveCartForUser(userId);
};

export const clearActiveCart = async (userId: number): Promise<CartResponse> => {
  const cart = await findActiveCart(userId);
  if (cart) {
    await database.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  return getActiveCartForUser(userId);
};
