import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the Prépositions API follows the cahier-constructions flag', async () => {
  const flags = await (await fetch(`${base}/api/flags`)).json();
  const session = await fetch(`${base}/api/constructions/prepositions/session`);
  if (flags['cahier-constructions'] !== true) {
    assert.equal(session.status, 404);
    return;
  }
  assert.equal(session.status, 200);
  const { cards, preparing } = await session.json();
  assert.ok(Array.isArray(cards));
  assert.equal(typeof preparing, 'number');
  const refused = await fetch(`${base}/api/constructions/prepositions/answers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: 'penser', item: 'penser à qqn/qqch', outcome: 'peut-être' }),
  });
  assert.equal(refused.status, 400);
});
