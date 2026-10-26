import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createFlags } from '../server/flags.js';
import { createMyWords } from '../server/myWords.js';
import { createWordLists } from '../server/wordLists.js';
import { withServer } from './helpers.js';

function appWith({ on }) {
  const db = openDb(':memory:');
  return createApp({
    db,
    myWords: createMyWords(db),
    wordLists: createWordLists(db),
    flags: createFlags({ overrides: { 'sac-de-mots': on } }),
    logger: { error() {} },
  });
}

const send = (base, path, method, body) =>
  fetch(`${base}${path}`, {
    method,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

test('with the flag off, the list API does not exist', () =>
  withServer(appWith({ on: false }), async (base) => {
    for (const [path, method, body] of [['/api/lists', 'GET'], ['/api/lists', 'POST', { name: 'Maison' }], ['/api/lists/1', 'GET']]) {
      const res = await send(base, path, method, body);
      assert.equal(res.status, 404, `${method} ${path}`);
      assert.deepEqual(await res.json(), { error: 'not_found' });
    }
  }));

test('with the flag on, lists can be created, read, renamed and deleted', () =>
  withServer(appWith({ on: true }), async (base) => {
    const created = await send(base, '/api/lists', 'POST', { name: 'Maison', emoji: '🏠' });
    assert.equal(created.status, 201);
    const list = await created.json();
    assert.equal(list.name, 'Maison');
    assert.equal(list.emoji, '🏠');
    assert.equal(list.wordCount, 0);

    assert.deepEqual(await (await send(base, '/api/lists', 'GET')).json(), [list]);
    assert.deepEqual(await (await send(base, `/api/lists/${list.id}`, 'GET')).json(), list);

    const renamed = await send(base, `/api/lists/${list.id}`, 'PATCH', { name: 'Cuisine' });
    assert.equal(renamed.status, 200);
    assert.deepEqual(await renamed.json(), { ...list, name: 'Cuisine' });

    assert.equal((await send(base, `/api/lists/${list.id}`, 'DELETE')).status, 204);
    assert.equal((await send(base, `/api/lists/${list.id}`, 'GET')).status, 404);
    assert.equal((await send(base, `/api/lists/${list.id}`, 'DELETE')).status, 404);
  }));

test('invalid or clashing lists are refused with a reason', () =>
  withServer(appWith({ on: true }), async (base) => {
    await send(base, '/api/lists', 'POST', { name: 'Maison' });
    const cases = [
      [{ name: 'maison' }, 409, 'name_taken'],
      [{ name: '' }, 400, 'invalid_name'],
      [{ name: 'X', emoji: 'ab' }, 400, 'invalid_emoji'],
    ];
    for (const [body, status, error] of cases) {
      const res = await send(base, '/api/lists', 'POST', body);
      assert.equal(res.status, status, JSON.stringify(body));
      assert.deepEqual(await res.json(), { error });
    }
  }));

test('unknown or malformed list ids are not found', () =>
  withServer(appWith({ on: true }), async (base) => {
    for (const path of ['/api/lists/abc', '/api/lists/0', '/api/lists/1.5', '/api/lists/999']) {
      assert.equal((await send(base, path, 'GET')).status, 404, path);
      assert.equal((await send(base, path, 'PATCH', { name: 'X' })).status, 404, path);
    }
  }));
