import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createMyWords } from '../server/myWords.js';
import { createFlags, createUnleashClient, parseOverrides } from '../server/flags.js';
import { withServer } from './helpers.js';

function fakeUnleash(states) {
  const calls = [];
  return {
    calls,
    isEnabled(name, context, fallback) {
      calls.push({ name, context, fallback });
      return states[name] ?? fallback;
    },
    getFeatureToggleDefinitions: () => Object.keys(states).map((name) => ({ name })),
  };
}

function appWith(flags) {
  const db = openDb(':memory:');
  return createApp({ db, myWords: createMyWords(db), logger: { error() {} }, ...(flags && { flags }) });
}

test('every flag is off without Unleash or overrides', () => {
  const flags = createFlags();
  assert.equal(flags.isEnabled('anything', {}), false);
  assert.deepEqual(flags.snapshot({}), {});
});

test('Unleash decides each flag, given the visitor context and an off fallback', () => {
  const client = fakeUnleash({ 'new-quiz': true, beta: false });
  const context = { sessionId: 's1', remoteAddress: '10.0.0.1' };
  assert.deepEqual(createFlags({ client }).snapshot(context), { 'new-quiz': true, beta: false });
  assert.deepEqual(client.calls[0], { name: 'new-quiz', context, fallback: false });
});

test('overrides win over Unleash', () => {
  const flags = createFlags({ client: fakeUnleash({ 'new-quiz': true }), overrides: { 'new-quiz': false, 'local-only': true } });
  assert.deepEqual(flags.snapshot({}), { 'new-quiz': false, 'local-only': true });
});

test('parseOverrides reads a name=on|off list', () => {
  assert.deepEqual(parseOverrides('a=on, b=off,c=true,d=0'), { a: true, b: false, c: true, d: false });
  assert.deepEqual(parseOverrides(''), {});
  assert.deepEqual(parseOverrides(undefined), {});
  assert.throws(() => parseOverrides('a=maybe'), /a=maybe/);
});

test('createUnleashClient is null until both URL and token are set', () => {
  assert.equal(createUnleashClient({}), null);
  assert.equal(createUnleashClient({ UNLEASH_URL: 'http://unleash:4242/api' }), null);
  assert.equal(createUnleashClient({ UNLEASH_API_TOKEN: 'default:development.x' }), null);
});

test('GET /api/flags is empty by default', () =>
  withServer(appWith(), async (base) => {
    assert.deepEqual(await (await fetch(`${base}/api/flags`)).json(), {});
  }));

test('GET /api/flags evaluates the flags for this visitor', () => {
  const seen = [];
  const flags = { snapshot: (context) => (seen.push(context), { 'new-quiz': true }) };
  return withServer(appWith(flags), async (base) => {
    const res = await fetch(`${base}/api/flags`, {
      headers: { cookie: 'other=1; cahier_sid=abc', 'user-agent': 'test-agent', 'x-forwarded-for': '192.168.5.50' },
    });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal(res.headers.get('set-cookie'), null);
    assert.deepEqual(await res.json(), { 'new-quiz': true });
    assert.deepEqual(seen[0], { sessionId: 'abc', remoteAddress: '192.168.5.50', properties: { userAgent: 'test-agent' } });
  });
});

test('GET /api/flags gives a new visitor a session cookie for sticky rollouts', () => {
  const seen = [];
  const flags = { snapshot: (context) => (seen.push(context), {}) };
  return withServer(appWith(flags), async (base) => {
    const cookie = (await fetch(`${base}/api/flags`)).headers.get('set-cookie');
    const [, id] = cookie.match(/^cahier_sid=([0-9a-f-]{36});/);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
    assert.equal(seen[0].sessionId, id);
  });
});
