import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

test('a Memoir question offers four distinct options, or says there are too few words', async () => {
  const res = await fetch(`${base}/api/memoir/question`);
  if (res.status === 404) {
    assert.deepEqual(await res.json(), { error: 'not_enough_words' });
    return;
  }
  assert.equal(res.status, 200);
  const { options, answer } = await res.json();
  assert.equal(options.length, 4);
  assert.equal(new Set(options).size, 4);
  assert.ok(Number.isInteger(answer) && answer >= 0 && answer < options.length, `answer ${answer}`);
});

test('a definition question is answered with the French word itself', async (t) => {
  for (let attempt = 0; attempt < 30; attempt++) {
    const res = await fetch(`${base}/api/memoir/question`);
    if (res.status === 404) return t.skip('too few saved words');
    const { word, direction, clue, options, answer } = await res.json();
    if (clue.kind !== 'definition') continue;
    assert.equal(direction, 'fr-fr');
    assert.equal(options[answer], word);
    return;
  }
  t.skip('no definition question in 30 tries');
});
