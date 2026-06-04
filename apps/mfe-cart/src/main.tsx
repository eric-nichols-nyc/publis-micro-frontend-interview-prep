import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@repo/mfe-shared/tokens.css";
import "./styles.css";
import { StandaloneCartApp } from "./features/cart/components/standalone-cart-app";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <div className="remote-standalone">
        <p className="remote-standalone__banner">
          Standalone dev mode — normally loaded by the shell.
        </p>
        <StandaloneCartApp />
      </div>
    </StrictMode>
  );
}
