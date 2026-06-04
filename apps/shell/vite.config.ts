import path from "node:path";
import { fileURLToPath } from "node:url";
import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { federationShared } from "@repo/mfe-shared/federation-shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Remote entry URLs are resolved at shell build time (not runtime).
// Set VITE_MFE_*_URL in the environment or copy apps/shell/.env.example.
// See README “Production remote URLs” and spec 09-prod-remote-env.md.
const productsRemoteEntry =
  process.env.VITE_MFE_PRODUCTS_URL ??
  "http://localhost:5174/remoteEntry.js";
const cartRemoteEntry =
  process.env.VITE_MFE_CART_URL ?? "http://localhost:5175/remoteEntry.js";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      dts: false,
      remotes: {
        mfe_products: {
          type: "module",
          name: "mfe_products",
          entry: productsRemoteEntry,
          entryGlobalName: "mfe_products",
          shareScope: "default",
        },
        mfe_cart: {
          type: "module",
          name: "mfe_cart",
          entry: cartRemoteEntry,
          entryGlobalName: "mfe_cart",
          shareScope: "default",
        },
      },
      shared: federationShared,
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    origin: "http://localhost:5173",
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@repo/design-system": path.resolve(__dirname, "../../packages/design-system"),
    },
  },
  build: {
    target: "esnext",
    minify: false,
  },
});
