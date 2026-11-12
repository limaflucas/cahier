import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the Genre API follows the cahier-constructions flag', async () => {
  const flags = await (await fetch(`${base}/api/flags`)).json();
  const session = await fetch(`${base}/api/constructions/genre/session`);
  if (flags['cahier-constructions'] !== true) {
    assert.equal(session.status, 404);
    return;
  }
  assert.equal(session.status, 200);
  const { cards } = await session.json();
  assert.ok(Array.isArray(cards));
  for (const { articles, answer } of cards) assert.ok(articles.includes(answer));
});
