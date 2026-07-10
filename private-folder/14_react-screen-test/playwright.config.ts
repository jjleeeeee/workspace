import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173",
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
