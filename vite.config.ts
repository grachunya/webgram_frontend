import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
  server: {
    https: {},
    port: 5173,
  },
});
