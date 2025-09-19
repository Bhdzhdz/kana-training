import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/kana-training/",
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "e59b4938-4f40-4118-9e1c-c2362e27b429-00-2ffq6hgxnhgzy.janeway.replit.dev",
    ],
  },
});
