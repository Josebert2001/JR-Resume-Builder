import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Only split truly isolated heavy libraries that are loaded lazily.
          // DO NOT split React or any React-dependent UI libraries (Radix, etc.)
          // into separate chunks — doing so causes createContext initialization
          // order errors when chunks load before React is ready.
          if (id.includes("@react-pdf/renderer") || id.includes("@react-pdf")) {
            return "vendor-pdf";
          }
          if (id.includes("node_modules/docx")) {
            return "vendor-docx";
          }
          if (id.includes("html2canvas")) {
            return "vendor-canvas";
          }
        },
      },
    },
  },
});
