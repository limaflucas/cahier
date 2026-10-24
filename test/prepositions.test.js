import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrepositionFinder } from '../server/prepositions.js';

const clientReturning = (message, seen = []) => ({
  messages: { parse: async (params) => (seen.push(params), message) },
});

test('returns the parsed constructions for the verb', async () => {
  const constructions = [{ pattern: 'penser à qqn/qqch', meaning: 'pensar em', example: 'Je pense à toi.' }];
  const seen = [];
  const find = createPrepositionFinder({ client: clientReturning({ parsed_output: { constructions } }, seen) });
  assert.deepEqual(await find('penser'), constructions);
  assert.match(seen[0].messages[0].content, /« penser »/);
  assert.ok(seen[0].output_config.format);
});

test('throws when nothing could be parsed', async () => {
  const find = createPrepositionFinder({ client: clientReturning({ parsed_output: null, stop_reason: 'max_tokens' }) });
  await assert.rejects(find('penser'), /max_tokens/);
});
