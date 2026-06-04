import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { federationShared } from "@repo/mfe-shared/federation-shared";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mfe_products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsPage": "./src/ProductsPage.tsx",
      },
      shared: federationShared,
    }),
  ],
  server: {
    port: 5174,
    strictPort: true,
    origin: "http://localhost:5174",
  },
  preview: {
    port: 5174,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: false,
  },
});
