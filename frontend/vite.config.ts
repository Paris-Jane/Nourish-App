import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      api: path.resolve(__dirname, "src/api"),
      components: path.resolve(__dirname, "src/components"),
      hooks: path.resolve(__dirname, "src/hooks"),
      lib: path.resolve(__dirname, "src/lib"),
      pages: path.resolve(__dirname, "src/pages"),
      store: path.resolve(__dirname, "src/store"),
      types: path.resolve(__dirname, "src/types"),
    },
  },
  server: {
    port: 5173,
  },
});
