import { useCallback, useMemo, useState } from "react";
import { initialCartLines } from "../lib/initial-cart-lines";
import type { CartLine } from "../types";

function lineTotal(line: CartLine): number {
  return line.price * line.quantity;
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>(initialCartLines);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + lineTotal(line), 0),
    [lines],
  );

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

  return {
    lines,
    subtotal,
    updateQuantity,
    removeLine,
  };
}
