import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    nodePolyfills(),
  ],
  build: {
    target: 'esnext'
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
