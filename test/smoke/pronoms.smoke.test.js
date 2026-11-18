import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the deployed app ships the Pronoms page', async () => {
  const page = await (await fetch(`${base}/`)).text();
  const [, script] = page.match(/<script[^>]+src="([^"]+\.js)"/) ?? [];
  assert.ok(script, 'the home page loads no script');
  const bundle = await (await fetch(new URL(script, `${base}/`))).text();
  assert.match(bundle, /Pronoms personnels sujets/);
  assert.match(bundle, /Pronoms indéfinis/);
});

test('the deployed Pronoms and COD et COI pages link to each other', async () => {
  const page = await (await fetch(`${base}/`)).text();
  const [, script] = page.match(/<script[^>]+src="([^"]+\.js)"/) ?? [];
  assert.ok(script, 'the home page loads no script');
  const bundle = await (await fetch(new URL(script, `${base}/`))).text();
  assert.match(bundle, /\/grammaire\/cod-coi#place/);
  assert.match(bundle, /\/pronoms#tableau/);
});
