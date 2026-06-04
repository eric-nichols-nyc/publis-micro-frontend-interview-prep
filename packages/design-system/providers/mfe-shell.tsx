import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { ThemeProvider } from "./theme";

/**
 * Design-system root for Vite MFE shell — theme, tooltips, toasts only.
 * Omits auth provider; shell loads user via `ApiUserProvider` + API (`@repo/neon-auth`).
 */
export const MfeShellProvider = ({
  children,
  ...properties
}: ThemeProviderProps) => (
  <ThemeProvider {...properties}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
