import type { ReactNode } from "react";

type NeonAuthProviderProps = {
  children: ReactNode;
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

/**
 * Design-system / app root slot for Neon Auth UI.
 * Passthrough until sign-in UI is wired (spec 07); shell uses ApiUserProvider + API for user state.
 */
export const NeonAuthProvider = ({ children }: NeonAuthProviderProps) => (
  <>{children}</>
);
