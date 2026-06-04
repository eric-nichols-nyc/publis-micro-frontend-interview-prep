import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@repo/mfe-shared";

export type AuthSessionStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated"
  | "error";

export type AuthSessionContextValue = {
  status: AuthSessionStatus;
  user: User | null;
  errorMessage: string | null;
  /** True only on first `/api/me` before the shell renders routes */
  isBootstrapping: boolean;
  /** True when re-fetching session (sign-in / sign-out) without blocking the shell */
  isReloading: boolean;
  reloadUser: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type ProviderProps = {
  value: AuthSessionContextValue;
  children: ReactNode;
};

export function AuthSessionProvider({ value, children }: ProviderProps) {
  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within ApiUserProvider");
  }
  return context;
}
