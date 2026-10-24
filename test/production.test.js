import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDb } from '../server/db.js';
import { createApp } from '../server/app.js';
import { createMyWords } from '../server/myWords.js';
import { withServer } from './helpers.js';

function builtSpa() {
  const dir = mkdtempSync(join(tmpdir(), 'cahier-dist-'));
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'index.html'), '<!doctype html><title>Cahier</title><div id="root"></div>');
  writeFileSync(join(dir, 'assets', 'app.js'), 'export {};');
  return dir;
}

function appWith(options = {}) {
  const db = openDb(':memory:');
  return createApp({ db, myWords: createMyWords(db), logger: { error() {} }, ...options });
}

test('serves the SPA shell at / and at client-side routes', () =>
  withServer(appWith({ staticDir: builtSpa() }), async (base) => {
    for (const path of ['/', '/mes-mots', '/mot/belle', '/conjugaison/aller']) {
      const res = await fetch(`${base}${path}`);
      assert.equal(res.status, 200, path);
      assert.match(res.headers.get('content-type'), /text\/html/, path);
      assert.match(await res.text(), /<title>Cahier<\/title>/, path);
    }
  }));

test('serves built assets', () =>
  withServer(appWith({ staticDir: builtSpa() }), async (base) => {
    const res = await fetch(`${base}/assets/app.js`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /javascript/);
  }));

test('unknown API routes answer a JSON 404, not the SPA shell', () =>
  withServer(appWith({ staticDir: builtSpa() }), async (base) => {
    const res = await fetch(`${base}/api/nope`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not_found' });
  }));

test('GET /api/version reports the running build', () =>
  withServer(appWith({ build: { name: 'cahier', version: '1.2.3', commit: 'abc123' } }), async (base) => {
    assert.deepEqual(await (await fetch(`${base}/api/version`)).json(), { name: 'cahier', version: '1.2.3', commit: 'abc123' });
  }));

test('the page title is Cahier', () => {
  assert.match(readFileSync(new URL('../web/index.html', import.meta.url), 'utf8'), /<title>Cahier<\/title>/);
});
