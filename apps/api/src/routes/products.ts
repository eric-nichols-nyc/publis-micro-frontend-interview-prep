import { type IRouter, Router } from "express";
import { z } from "zod";
import { sendError } from "../lib/errors.js";
import {
  findAllProducts,
  findProductById,
  toProductResponse,
} from "../lib/products.js";

export const productsRouter: IRouter = Router();

const idParamSchema = z.string().trim().min(1);

productsRouter.get("/", async (_req, res, next) => {
  try {
    const products = await findAllProducts();
    res.json(products.map(toProductResponse));
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const parsed = idParamSchema.safeParse(req.params.id);
    if (!parsed.success) {
      sendError(res, 400, "VALIDATION_ERROR", "Invalid product id");
      return;
    }

    const product = await findProductById(parsed.data);
    if (!product) {
      sendError(res, 404, "NOT_FOUND", "Product not found");
      return;
    }

    res.json(toProductResponse(product));
  } catch (error) {
    next(error);
  }
});
