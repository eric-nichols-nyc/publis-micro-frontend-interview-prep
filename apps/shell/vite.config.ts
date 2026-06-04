import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { federationShared } from "@repo/mfe-shared/federation-shared";

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
  build: {
    target: "esnext",
    minify: false,
  },
});
