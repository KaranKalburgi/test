import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: false,
  retries: 1,
  workers: 1,
  reporter: "html",
  timeout: 100000,
  expect: {
    timeout: 100000,
  },
  use: {
    //baseURL: 'https://axaxl.com',
    baseURL: process.env.SF_BASE_URL,
    headless: false,
    viewport: {
      width: 1440,
      height: 1200,
    },
    actionTimeout: 100000,
    navigationTimeout: 100000,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
    },
  ],
});