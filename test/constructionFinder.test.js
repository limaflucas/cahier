import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PrepositionList, createPrepositionFinder } from '../server/prepositions.js';

const PENSER_A = {
  pattern: 'penser à qqn/qqch',
  meaning: 'pensar em alguém/algo',
  example: 'Je pense à toi.',
  gap: 'Je pense ___ toi.',
  answer: 'à',
  portuguese: 'pensar em alguém/algo',
  differsFromPortuguese: true,
};

test('each construction comes with its gap sentence, answer and Portuguese construction', () => {
  assert.equal(PrepositionList.safeParse({ constructions: [PENSER_A] }).success, true);
  const { gap, ...withoutGap } = PENSER_A;
  assert.equal(PrepositionList.safeParse({ constructions: [withoutGap] }).success, false);
});

test('Claude is asked for constructions without a preposition too, with room for the longer reply', async () => {
  const seen = [];
  const client = { messages: { parse: async (params) => (seen.push(params), { parsed_output: { constructions: [PENSER_A] } }) } };
  assert.deepEqual(await createPrepositionFinder({ client })('aimer'), [PENSER_A]);
  assert.match(seen[0].messages[0].content, /gostar de/);
  assert.match(seen[0].messages[0].content, /___/);
  assert.ok(seen[0].max_tokens >= 4096);
});
