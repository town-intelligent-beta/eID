import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/eID/',
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://beta-eid-backend.4impact.cc",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
