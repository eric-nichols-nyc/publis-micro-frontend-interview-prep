import type { CartLine, Product } from "@repo/mfe-shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiClientError } from "../../auth/lib/api-client";
import { useAuthSession } from "../../auth/context/auth-session-context";
import {
  addCartItem as addCartItemApi,
  fetchCart,
  removeCartItem as removeCartItemApi,
  updateCartItemQuantity as updateCartItemQuantityApi,
} from "../lib/cart-api-client";

function lineTotal(line: CartLine): number {
  return line.price * line.quantity;
}

type CartLoadState =
  | { status: "idle"; errorMessage: null }
  | { status: "loading"; errorMessage: null }
  | { status: "ready"; errorMessage: null }
  | { status: "error"; errorMessage: string };

export function useShellCart() {
  const { status: authStatus } = useAuthSession();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loadState, setLoadState] = useState<CartLoadState>({
    status: "idle",
    errorMessage: null,
  });

  const isAuthenticated = authStatus === "authenticated";

  const applyCartError = useCallback((error: unknown) => {
    const message =
      error instanceof ApiClientError
        ? `${error.code}: ${error.message}`
        : error instanceof Error
          ? error.message
          : "Cart request failed";
    setLoadState({ status: "error", errorMessage: message });
  }, []);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setLines([]);
      setLoadState({ status: "idle", errorMessage: null });
      return;
    }

    setLoadState({ status: "loading", errorMessage: null });

    try {
      const nextLines = await fetchCart();
      setLines(nextLines);
      setLoadState({ status: "ready", errorMessage: null });
    } catch (error) {
      applyCartError(error);
    }
  }, [applyCartError, isAuthenticated]);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + lineTotal(line), 0),
    [lines],
  );

  const addToCart = useCallback(
    async (productId: string, catalog: Product[]) => {
      if (!isAuthenticated) {
        return;
      }

      const existsInCatalog = catalog.some((item) => item.id === productId);
      if (!existsInCatalog) {
        return;
      }

      try {
        const nextLines = await addCartItemApi(productId);
        setLines(nextLines);
        setLoadState({ status: "ready", errorMessage: null });
      } catch (error) {
        applyCartError(error);
      }
    },
    [applyCartError, isAuthenticated],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const nextLines = await updateCartItemQuantityApi(lineId, quantity);
        setLines(nextLines);
        setLoadState({ status: "ready", errorMessage: null });
      } catch (error) {
        applyCartError(error);
      }
    },
    [applyCartError, isAuthenticated],
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const nextLines = await removeCartItemApi(lineId);
        setLines(nextLines);
        setLoadState({ status: "ready", errorMessage: null });
      } catch (error) {
        applyCartError(error);
      }
    },
    [applyCartError, isAuthenticated],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  return {
    lines,
    subtotal,
    itemCount,
    addToCart,
    updateQuantity,
    removeLine,
    cartStatus: loadState.status,
    cartErrorMessage: loadState.errorMessage,
    reloadCart: loadCart,
  };
}

export type ShellCartSession = ReturnType<typeof useShellCart>;
