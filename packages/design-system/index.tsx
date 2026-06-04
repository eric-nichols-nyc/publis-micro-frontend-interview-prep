import { NeonAuthProvider } from "@repo/neon-auth/provider";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./providers/theme";

type DesignSystemProviderProperties = ThemeProviderProps & {
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const DesignSystemProvider = ({
  children,
  privacyUrl,
  termsUrl,
  helpUrl,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <NeonAuthProvider
      helpUrl={helpUrl}
      privacyUrl={privacyUrl}
      termsUrl={termsUrl}
    >
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </NeonAuthProvider>
  </ThemeProvider>
);
