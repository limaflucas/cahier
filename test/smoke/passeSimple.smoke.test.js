import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the conjugation board includes the passé simple', async () => {
  const res = await fetch(`${base}/api/conjugation/prendre`);
  assert.equal(res.status, 200);
  const { tenses } = await res.json();
  assert.deepEqual(tenses.passeSimple?.cells.map((cell) => cell.answers[0]), ['pris', 'pris', 'prit', 'prîmes', 'prîtes', 'prirent']);
});

test('the reference page ships the passé simple', async () => {
  const shell = await (await fetch(`${base}/temps-verbaux`)).text();
  const script = shell.match(/<script type="module"[^>]* src="([^"]+)"/)?.[1];
  assert.ok(script, 'no module script in the app shell');
  assert.match(await (await fetch(`${base}${script}`)).text(), /Passé simple/);
});
