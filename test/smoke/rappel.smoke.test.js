import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the Rappel API follows the cahier-rappel flag', async () => {
  const flags = await (await fetch(`${base}/api/flags`)).json();
  const session = await fetch(`${base}/api/rappel/session`);
  if (flags['cahier-rappel'] !== true) {
    assert.equal(session.status, 404);
    return;
  }
  assert.equal(session.status, 200);
  assert.ok(Array.isArray((await session.json()).cards));
  const refused = await fetch(`${base}/api/rappel/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: 'penser', outcome: 'peut-être' }),
  });
  assert.equal(refused.status, 400);
  assert.deepEqual(await refused.json(), { error: 'invalid_answer' });
});
