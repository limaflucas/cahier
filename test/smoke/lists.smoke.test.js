import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the list API follows the sac-de-mots flag', async () => {
  const flags = await (await fetch(`${base}/api/flags`)).json();
  const res = await fetch(`${base}/api/lists`);
  if (flags['sac-de-mots'] === true) {
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(await res.json()));
  } else {
    assert.equal(res.status, 404);
  }
});
