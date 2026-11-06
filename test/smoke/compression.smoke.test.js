import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const ACCEPT = { 'Accept-Encoding': 'br, gzip' };

test('the app bundle is served compressed', async () => {
  const html = await (await fetch(`${base}/`)).text();
  const script = html.match(/src="(\/assets\/[^"]+\.js)"/)?.[1];
  assert.ok(script, 'index.html loads a script bundle');
  const res = await fetch(`${base}${script}`, { headers: ACCEPT });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-encoding') ?? '', /^(br|gzip)$/);
});

test('large API replies are served compressed', async () => {
  const res = await fetch(`${base}/api/conjugation/${encodeURIComponent('être')}`, { headers: ACCEPT });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-encoding') ?? '', /^(br|gzip)$/);
  assert.ok((await res.json()).tenses, 'the conjugation board parses');
});
