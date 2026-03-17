import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Headlamp branding plugin E2E tests
 * 
 * These tests verify theme switching behavior in a running Headlamp instance.
 * Prerequisites: Headlamp must be running on http://localhost:4466
 */
export default defineConfig({
  testDir: './e2e',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all the projects below
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:4466',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before starting the tests
  // Note: This assumes Headlamp is already running externally
  // If you want to start Headlamp automatically, uncomment and configure:
  // webServer: {
  //   command: 'podman run -p 4466:4466 -v $(pwd)/dist:/headlamp/plugins/branding ghcr.io/headlamp-k8s/headlamp:latest',
  //   url: 'http://localhost:4466',
  //   reuseExistingServer: !process.env.CI,
  // },
});
