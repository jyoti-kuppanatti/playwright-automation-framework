import { defineConfig, devices } from '@playwright/test';
import { ENV } from './config/env';

export default defineConfig({

 use: {
    baseURL: ENV.BASE_URL,
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },

  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
