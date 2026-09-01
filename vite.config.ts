import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/",
  server: { port: 5188, host: true, strictPort: true },
  preview: { port: 4188, host: true, strictPort: true },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: "./src/test/setup.ts",
  },
});
