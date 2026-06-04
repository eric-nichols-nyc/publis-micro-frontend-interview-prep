import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MfeShellProvider } from "@repo/design-system/providers/mfe-shell";
import "@repo/design-system/styles/globals.css";
import "@repo/mfe-shared/tokens.css";
import "./styles.css";
import { App } from "./app";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <MfeShellProvider
        defaultTheme="light"
        disableTransitionOnChange
        enableSystem={false}
        forcedTheme="light"
      >
        <App />
      </MfeShellProvider>
    </StrictMode>
  );
}
