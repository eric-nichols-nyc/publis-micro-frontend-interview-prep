import type { CartLine, Product } from "@repo/mfe-shared";
import { useCallback, useMemo, useState } from "react";

function lineTotal(line: CartLine): number {
  return line.price * line.quantity;
}

function buildCartLine(product: Product): CartLine {
  return {
    id: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  };
}

export function useShellCart() {
  const [lines, setLines] = useState<CartLine[]>([]);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + lineTotal(line), 0),
    [lines],
  );

  const addToCart = useCallback((productId: string, catalog: Product[]) => {
    const product = catalog.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    setLines((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (existing) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...current, buildCartLine(product)];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((current) => current.filter((line) => line.id !== lineId));
      return;
    }

    setLines((current) =>
      current.map((line) =>
        line.id === lineId ? { ...line, quantity } : line,
      ),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((current) => current.filter((line) => line.id !== lineId));
  }, []);

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
  };
}

export type ShellCartSession = ReturnType<typeof useShellCart>;
