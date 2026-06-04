import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@repo/mfe-shared/tokens.css";
import "./styles.css";
import { ProductsPage } from "./ProductsPage";
import { mockUser } from "@repo/mfe-shared";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <div className="remote-standalone">
        <p className="remote-standalone__banner">
          Standalone dev mode — normally loaded by the shell.
        </p>
        <ProductsPage user={mockUser} />
      </div>
    </StrictMode>
  );
}
