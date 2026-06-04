import { type IRouter, Router } from "express";
import { z } from "zod";
import {
  addCartItem,
  clearActiveCart,
  getActiveCartForUser,
  removeCartItem,
  resolveDbUserFromAuth,
  updateCartItemQuantity,
} from "../lib/cart.js";
import { sendError } from "../lib/errors.js";
import { authMiddleware, requireUser } from "../middleware/auth.js";

export const cartRouter: IRouter = Router();

cartRouter.use(authMiddleware, requireUser);

const addItemBodySchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1).optional(),
});

const updateQuantityBodySchema = z.object({
  quantity: z.number().int().min(0),
});

const itemIdParamSchema = z.string().trim().min(1);

cartRouter.get("/", async (req, res, next) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const user = await resolveDbUserFromAuth(authUser);
    const cart = await getActiveCartForUser(user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

cartRouter.post("/items", async (req, res, next) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const parsed = addItemBodySchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid request body");
      return;
    }

    const user = await resolveDbUserFromAuth(authUser);
    const cart = await addCartItem(
      user.id,
      parsed.data.productId,
      parsed.data.quantity ?? 1
    );
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
});

cartRouter.patch("/items/:itemId", async (req, res, next) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const itemIdParsed = itemIdParamSchema.safeParse(req.params.itemId);
    if (!itemIdParsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid cart item id");
      return;
    }

    const bodyParsed = updateQuantityBodySchema.safeParse(req.body);
    if (!bodyParsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid request body");
      return;
    }

    const user = await resolveDbUserFromAuth(authUser);
    const cart = await updateCartItemQuantity(
      user.id,
      itemIdParsed.data,
      bodyParsed.data.quantity
    );
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/items/:itemId", async (req, res, next) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const parsed = itemIdParamSchema.safeParse(req.params.itemId);
    if (!parsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid cart item id");
      return;
    }

    const user = await resolveDbUserFromAuth(authUser);
    const cart = await removeCartItem(user.id, parsed.data);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/", async (req, res, next) => {
  try {
    const authUser = req.user;
    if (!authUser) {
      sendError(res, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const user = await resolveDbUserFromAuth(authUser);
    const cart = await clearActiveCart(user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});
