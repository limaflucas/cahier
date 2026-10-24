import { test, expect } from '@playwright/test';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const port = 4175;
const fixture = (word) => readFileSync(new URL(`../fixtures/reverso-${word}.json`, import.meta.url), 'utf8');

function oldInstall(dir) {
  const path = join(dir, 'old.db');
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE my_words (word TEXT PRIMARY KEY, added_at TEXT NOT NULL);
    CREATE TABLE reverso_cache (query TEXT PRIMARY KEY, json TEXT NOT NULL, fetched_at TEXT NOT NULL);
  `);
  for (const [word, addedAt] of [['belle', '2026-10-15 00:43:49'], ['homme', '2026-10-16 10:00:00']]) {
    db.prepare('INSERT INTO my_words VALUES (?, ?)').run(word, addedAt);
    db.prepare('INSERT INTO reverso_cache VALUES (?, ?, ?)').run(word, fixture(word), addedAt);
  }
  db.close();
  return path;
}

async function serve(dbPath) {
  const server = spawn(process.execPath, ['server/index.js'], {
    env: { ...process.env, PORT: String(port), DB_PATH: dbPath, ANTHROPIC_API_KEY: '', NODE_OPTIONS: '--no-warnings' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 50; i++) {
    if (await fetch(`http://localhost:${port}/api/health`).then((r) => r.ok, () => false)) return server;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  server.kill();
  throw new Error('server did not start');
}

test('words from the old install show up in Mes mots after the import', async ({ page }) => {
  const dir = mkdtempSync(join(tmpdir(), 'cahier-import-'));
  const target = join(dir, 'french.db');
  const report = JSON.parse(execFileSync(process.execPath, ['scripts/import-data.js', oldInstall(dir), target], { encoding: 'utf8' }));
  expect(report.my_words).toEqual({ source: 2, imported: 2 });

  const server = await serve(target);
  try {
    await page.goto(`http://localhost:${port}/mes-mots`);
    await expect(page.getByRole('heading', { name: 'Mes mots (2)' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'belle', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'homme', exact: true })).toBeVisible();
  } finally {
    server.kill();
  }
});
