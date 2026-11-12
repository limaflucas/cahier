import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the saved-word route checks its word and says when it is not saved', async () => {
  assert.equal((await fetch(`${base}/api/my-words/%20`)).status, 400);
  const unsaved = await fetch(`${base}/api/my-words/${encodeURIComponent('zzz-pas-un-mot')}`);
  assert.equal(unsaved.status, 404);
  assert.deepEqual(await unsaved.json(), { error: 'not_saved' });
});
