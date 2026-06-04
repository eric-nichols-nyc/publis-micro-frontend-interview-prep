import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { ThemeProvider } from "./theme";

/**
 * Design-system root for Vite MFE shell — theme, tooltips, toasts only.
 * Omits Clerk `AuthProvider` (Next.js-only); shell uses mock user until spec 07.
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
