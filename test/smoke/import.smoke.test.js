import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const cli = fileURLToPath(new URL('../../scripts/import-data.js', import.meta.url));

test('the import CLI explains its usage', () => {
  const result = spawnSync(process.execPath, [cli], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /usage: node scripts\/import-data\.js <source\.db> \[target\.db\]/);
});

test('the installation holds the imported words', { skip: !process.env.EXPECTED_MIN_WORDS && 'EXPECTED_MIN_WORDS not set' }, async () => {
  const words = await (await fetch(`${base}/api/my-words`)).json();
  assert.ok(words.length >= Number(process.env.EXPECTED_MIN_WORDS), `only ${words.length} words`);
});
