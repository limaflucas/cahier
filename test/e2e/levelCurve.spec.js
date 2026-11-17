import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDb } from '../../server/db.js';

const PENSER_REPLY = readFileSync(new URL('../fixtures/reverso-penser.json', import.meta.url), 'utf8');

/**
 * A Reverso reply for a noun with a single meaning.
 * @param {string} word
 * @param {string} level
 * @returns {string} the reply as Reverso sends it
 */
const replyFor = (word, level) => JSON.stringify({
  OrigWord: word,
  DefsByWord: [{
    word,
    pronounceIpa: '',
    DefsByPos: [{
      Pos: 'Noun',
      gender: 'm',
      Defs: [{ Def: `sens de ${word}`, level, tags: [], translations: [{ lang: 'bp', translation: `tradução de ${word}` }], examples: [] }],
    }],
  }],
});

/**
 * Starts Cahier with Rappel on, over a database holding only these saved words and their cached Reverso replies.
 * @param {number} port
 * @param {{ word: string, addedAt: string, reply: string }[]} saved
 * @returns {Promise<{ url: string, stop: () => void }>}
 */
async function serveWith(port, saved) {
  const path = join(mkdtempSync(join(tmpdir(), 'cahier-levels-')), 'french.db');
  const db = openDb(path);
  for (const { word, addedAt, reply } of saved) {
    db.prepare('INSERT INTO my_words (word, added_at) VALUES (?, ?)').run(word, addedAt);
    db.prepare('INSERT INTO reverso_cache (query, json) VALUES (?, ?)').run(word, reply);
  }
  db.close();

  const server = spawn(process.execPath, ['server/index.js'], {
    env: {
      ...process.env,
      PORT: String(port),
      DB_PATH: path,
      FLAGS_OVERRIDE: 'cahier-rappel=on',
      UNLEASH_URL: '',
      ANTHROPIC_API_KEY: '',
      NODE_OPTIONS: '--no-warnings',
    },
    stdio: 'ignore',
  });
  const url = `http://localhost:${port}`;
  for (let i = 0; i < 50; i++) {
    if (await fetch(`${url}/api/health`).then((res) => res.ok, () => false)) return { url, stop: () => server.kill() };
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  server.kill();
  throw new Error('server did not start');
}

test('Rappel first asks for a word through a B1 to C1 meaning, not its A1 one', async ({ page }) => {
  const server = await serveWith(4176, [{ word: 'penser', addedAt: '2026-11-10 10:00:00', reply: PENSER_REPLY }]);
  try {
    await page.goto(`${server.url}/rappel`);
    await expect(page.getByText('Ele se lembra frequentemente das férias de verão.')).toBeVisible();
    await expect(page.getByText('lembrar-se', { exact: true })).toBeVisible();
  } finally {
    server.stop();
  }
});

test('a newly saved A1 word waits while B1 to C1 words come in', async ({ page }) => {
  const older = Array.from({ length: 11 }, (_, i) => `mot${String(i).padStart(2, '0')}`).map((word, i) => ({
    word, addedAt: `2026-11-01 10:${String(i).padStart(2, '0')}:00`, reply: replyFor(word, 'B2'),
  }));
  const server = await serveWith(4177, [...older, { word: 'facile', addedAt: '2026-11-15 10:00:00', reply: replyFor('facile', 'A1') }]);
  try {
    await page.clock.setFixedTime(new Date('2026-11-20T12:00:00'));
    const session = page.waitForResponse((res) => res.url().includes('/api/rappel/session'));
    await page.goto(`${server.url}/rappel`);
    const { cards } = await (await session).json();
    expect(cards.map(({ word }) => word)).not.toContain('facile');
    await expect(page.getByText('Restantes :')).toContainText('10');
  } finally {
    server.stop();
  }
});
