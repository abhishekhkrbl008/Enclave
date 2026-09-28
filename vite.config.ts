import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    nodePolyfills(),
    viteStaticCopy({
      targets: [
        {
          src: 'managed',
          dest: ''
        }
      ]
    }),
  ],
  build: {
    target: 'esnext'
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
