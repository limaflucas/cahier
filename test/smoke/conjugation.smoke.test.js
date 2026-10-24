import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the conjugation game ships the verb meanings icon', async () => {
  const shell = await (await fetch(`${base}/conjugaison/penser`)).text();
  const script = shell.match(/<script type="module"[^>]* src="([^"]+)"/)?.[1];
  assert.ok(script, 'no module script in the app shell');
  const res = await fetch(`${base}${script}`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Sens de « /);
});
