import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the running build is cahier, at the expected commit', async () => {
  const res = await fetch(`${base}/api/version`);
  assert.equal(res.status, 200);
  const build = await res.json();
  assert.equal(build.name, 'cahier');
  if (process.env.EXPECTED_COMMIT) assert.equal(build.commit, process.env.EXPECTED_COMMIT);
});

test('the home page is Cahier', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /<title>Cahier<\/title>/);
});

test('client-side routes load the app shell', async () => {
  for (const path of ['/mes-mots', '/mot/belle']) {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 200, path);
    assert.match(await res.text(), /<div id="root"><\/div>/, path);
  }
});
