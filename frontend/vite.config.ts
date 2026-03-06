import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    tsconfig: "frontend/tsconfig.frontend.json",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
    },
    setupFiles: "./src/tests/setupTests.ts",
  },
});
