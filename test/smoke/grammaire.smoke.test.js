import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the app ships the Grammaire list and the COD et COI page', async () => {
  const shell = await (await fetch(`${base}/grammaire/cod-coi`)).text();
  const script = shell.match(/<script type="module"[^>]* src="([^"]+)"/)?.[1];
  assert.ok(script, 'no module script in the app shell');
  const bundle = await (await fetch(`${base}${script}`)).text();
  assert.ok(bundle.includes('Fiches de grammaire'), `${script} has no Grammaire list`);
  assert.ok(bundle.includes('COD et COI'), `${script} has no COD et COI page`);
});
