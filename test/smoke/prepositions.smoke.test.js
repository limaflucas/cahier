import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the prepositions route checks its verb and never searches on its own', async () => {
  assert.equal((await fetch(`${base}/api/prepositions/%20`)).status, 400);
  const unknown = await fetch(`${base}/api/prepositions/${encodeURIComponent('zzz-pas-un-verbe')}`);
  assert.equal(unknown.status, 404);
  assert.deepEqual(await unknown.json(), { error: 'not_found' });
});
