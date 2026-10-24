import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toEntry, isVerb, fetchDefinition, UpstreamError } from '../server/reverso.js';
import { fixture } from './helpers.js';

test('toEntry maps a noun with gender, IPA and Portuguese senses', () => {
  const entry = toEntry(fixture('homme'));
  const [homme] = entry.words;
  assert.equal(homme.word, 'homme');
  assert.equal(homme.ipa, 'ɔm');
  assert.deepEqual(homme.sections.map((s) => [s.pos, s.gender]), [['Noun', 'm']]);
  assert.deepEqual(homme.sections[0].senses[0], {
    definition: 'être humain adulte de sexe masculin',
    level: 'A1',
    tags: [],
    translations: ['homem'],
    examples: homme.sections[0].senses[0].examples,
  });
  assert.deepEqual(homme.sections[0].senses[0].examples.slice(0, 2), [
    { fr: 'Cet homme travaille dans le bâtiment.', pt: 'Este homem trabalha na construção.' },
    { fr: 'Un homme attend devant la porte.', pt: null },
  ]);
  assert.deepEqual(homme.sections[0].senses[1].examples[0], {
    fr: "L'homme est apparu sur Terre il y a des millions d'années.",
    pt: '**O ser humano** apareceu na Terra há milhões de anos.',
  });
  assert.equal(isVerb(homme), false);
});

test('toEntry keeps every part of speech and only the first IPA variant', () => {
  const entry = toEntry(fixture('est'));
  assert.deepEqual(entry.words.map((w) => [w.word, w.ipa]), [['est', 'ɛst'], ['être', 'ɛtʁə']]);
  assert.ok(isVerb(entry.words[1]));
  assert.deepEqual(toEntry(fixture('belle')).words[0].sections.map((s) => s.pos), ['Adjective', 'Noun']);
});

test('toEntry returns null when Reverso finds nothing', () => {
  assert.equal(toEntry(fixture('mangeait')), null);
  assert.equal(toEntry({}), null);
});

test('fetchDefinition asks Reverso for Brazilian Portuguese', async () => {
  let requested;
  const capture = async (url) => {
    requested = new URL(url);
    return { ok: true, json: async () => ({}) };
  };
  await fetchDefinition('homme', { fetch: capture });
  assert.equal(requested.searchParams.get('targetLang'), 'bp');
});

test('fetchDefinition wraps HTTP and network failures', async () => {
  const failing = async () => ({ ok: false, status: 403 });
  await assert.rejects(fetchDefinition('homme', { fetch: failing }), UpstreamError);
  const offline = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(fetchDefinition('homme', { fetch: offline }), UpstreamError);
});
