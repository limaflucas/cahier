import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('flags are served as booleans, with a session cookie', async () => {
  const res = await fetch(`${base}/api/flags`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('set-cookie') ?? '', /cahier_sid=/);
  for (const [name, on] of Object.entries(await res.json())) assert.equal(typeof on, 'boolean', name);
});

test('flags come from Unleash', { skip: !process.env.EXPECTED_FLAGS && 'EXPECTED_FLAGS not set' }, async () => {
  const flags = await (await fetch(`${base}/api/flags`)).json();
  for (const name of process.env.EXPECTED_FLAGS.split(',')) assert.ok(name in flags, `${name} missing`);
});

test('Unleash is healthy', { skip: !process.env.UNLEASH_HEALTH_URL && 'UNLEASH_HEALTH_URL not set' }, async () => {
  const res = await fetch(process.env.UNLEASH_HEALTH_URL);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).health, 'GOOD');
});
