import { createContext, useContext, type ReactNode } from "react";
import {
  useShellCart,
  type ShellCartSession,
} from "../hooks/use-shell-cart";

const CartSessionContext = createContext<ShellCartSession | null>(null);

type CartSessionProviderProps = {
  children: ReactNode;
};

export function CartSessionProvider({ children }: CartSessionProviderProps) {
  const session = useShellCart();

  return (
    <CartSessionContext.Provider value={session}>
      {children}
    </CartSessionContext.Provider>
  );
}

export function useCartSession(): ShellCartSession {
  const session = useContext(CartSessionContext);
  if (!session) {
    throw new Error("useCartSession must be used within CartSessionProvider");
  }
  return session;
}
