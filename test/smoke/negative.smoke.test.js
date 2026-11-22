import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('the conjugation board carries the negative of every form', async () => {
  const res = await fetch(`${base}/api/conjugation/${encodeURIComponent('se lever')}`);
  assert.equal(res.status, 200);
  const { tenses } = await res.json();
  assert.deepEqual(tenses.passeCompose.cells.map((cell) => cell.negative), [
    'ne me suis pas levé', "ne t'es pas levé", "ne s'est pas levé",
    'ne nous sommes pas levés', 'ne vous êtes pas levés', 'ne se sont pas levés',
  ]);
  assert.deepEqual(tenses.participePasse.cells.map((cell) => cell.negative), ["ne s'étant pas levé"]);
});
