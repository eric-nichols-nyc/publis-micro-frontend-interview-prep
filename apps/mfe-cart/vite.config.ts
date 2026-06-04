import { federation } from "@module-federation/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { federationShared } from "@repo/mfe-shared/federation-shared";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mfe_cart",
      filename: "remoteEntry.js",
      exposes: {
        "./CartWidget": "./src/CartWidget.tsx",
      },
      shared: federationShared,
    }),
  ],
  server: {
    port: 5175,
    strictPort: true,
    origin: "http://localhost:5175",
  },
  preview: {
    port: 5175,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: false,
  },
});
