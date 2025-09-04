import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['tests/features/**/*.feature'],
  require: ['tests/steps/**/*.ts'],
  importTestFrom: 'tests/fixtures/fixtures.ts',  // <—
});


export default defineConfig({
  testDir, // <- this must be the value returned by defineBddConfig
  use: {
    baseURL: 'http://localhost:3456',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3456',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  reporter: [['html', { open: 'never' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
