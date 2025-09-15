import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// <https://vitejs.dev/config/>
export default defineConfig({
  plugins: [react()],
  build: {
    // Output client files to 'dist/client'
    outDir: "dist/client",
    rollupOptions: {
      input: "./index.html",
    },
  },
  ssr: {
    // Ensure SSR bundle gets built correctly
    target: "webworker",
    noExternal: true,
  },
  // Define the server for development
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
