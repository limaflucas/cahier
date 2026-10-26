import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const dbPath = (name) => join(tmpdir(), `cahier-e2e-${process.pid}-${name}.db`);

export default defineConfig({
  testDir: 'test/e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'line' : 'list',
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: [
    { port, env: { PORT: String(port), DB_PATH: dbPath('off') } },
    { port: port + 1, env: { PORT: String(port + 1), DB_PATH: dbPath('on'), FLAGS_OVERRIDE: 'version-badge=on,sac-de-mots=on', GIT_COMMIT: 'abcdef1234567' } },
  ].map(({ port, env }) => ({
    command: 'node server/index.js',
    port,
    reuseExistingServer: false,
    env: { ANTHROPIC_API_KEY: '', NODE_OPTIONS: '--no-warnings', ...env },
  })),
});
