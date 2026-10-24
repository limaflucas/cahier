import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const dbPath = join(tmpdir(), `cahier-e2e-${process.pid}.db`);

export default defineConfig({
  testDir: 'test/e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'line' : 'list',
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: {
    command: 'node server/index.js',
    port,
    reuseExistingServer: false,
    env: { PORT: String(port), DB_PATH: dbPath, ANTHROPIC_API_KEY: '', NODE_OPTIONS: '--no-warnings' },
  },
});
