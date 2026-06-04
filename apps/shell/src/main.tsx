import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@repo/mfe-shared/tokens.css";
import "./styles.css";
import { App } from "./app";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
