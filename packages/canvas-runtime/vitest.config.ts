import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.ts"],
    // canvas-runtime.tsx imports R3F which needs a browser context;
    // exclude the React component test — it would require jsdom + R3F mocking
    // and is covered separately in integration tests.
    exclude: ["tests/**/*.react.test.ts*"],
  },
});
