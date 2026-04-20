import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [],
  build: {
    target: "es2020",
    sourcemap: true,
  },
  server: {
    port: 5175,
    host: true,
  },
});
