import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../server/db.js';
import { articlesFor, endingRule, genreCard, genreGame } from '../server/genre.js';
import { createMyWords } from '../server/myWords.js';
import { toEntry } from '../server/reverso.js';
import { fixture } from './helpers.js';

const sense = (translations) => ({ level: 'A1', definition: 'déf', tags: [], translations, examples: [] });
const nounEntry = (word, gender, translations = ['casa', 'lar', 'moradia', 'residência']) =>
  ({ query: word, words: [{ word, ipa: null, sections: [{ pos: 'Noun', gender, senses: [sense(translations)] }] }] });

test('a noun starting with a vowel or h asks un or une', () => {
  assert.deepEqual(articlesFor('idée'), ['un', 'une']);
  assert.deepEqual(articlesFor('été'), ['un', 'une']);
  assert.deepEqual(articlesFor('homme'), ['un', 'une']);
  assert.deepEqual(articlesFor('maison'), ['le', 'la']);
});

test('a card asks for the article of a noun with one gender', () => {
  assert.deepEqual(genreCard('maison', nounEntry('maison', 'f')), {
    gender: 'f',
    articles: ['le', 'la'],
    answer: 'la',
    translations: ['casa', 'lar', 'moradia'],
    rule: { ending: 'aison', usualGender: 'f', exception: false },
  });
  const homme = genreCard('homme', toEntry(fixture('homme')));
  assert.equal(homme.answer, 'un');
  assert.deepEqual(homme.translations, ['homem']);
});

test('only nouns with one gender, m or f, as their first part of speech are cards', () => {
  assert.equal(genreCard('belle', toEntry(fixture('belle'))), null);
  assert.equal(genreCard('penser', toEntry(fixture('penser'))), null);
  assert.equal(genreCard('élève', nounEntry('élève', 'mf')), null);
  assert.equal(genreCard('gens', nounEntry('gens', null)), null);
  assert.equal(genreCard('rien', null), null);
});

test('the longest known ending gives the usual gender', () => {
  assert.deepEqual(endingRule('gouvernement', 'm'), { ending: 'ment', usualGender: 'm', exception: false });
  assert.deepEqual(endingRule('liberté', 'f'), { ending: 'té', usualGender: 'f', exception: false });
  assert.equal(endingRule('table', 'f'), null);
});

test('a noun against its ending is an exception', () => {
  assert.deepEqual(endingRule('plage', 'f'), { ending: 'age', usualGender: 'm', exception: true });
  assert.deepEqual(endingRule('eau', 'f'), { ending: 'eau', usualGender: 'm', exception: true });
});

test('a compound noun follows its first word', () => {
  assert.equal(endingRule('station-service', 'f').ending, 'tion');
  assert.equal(endingRule('maison de campagne', 'f').ending, 'aison');
});

test('the Genre game offers every saved word, and cards only for nouns', async () => {
  const db = openDb(':memory:');
  const myWords = createMyWords(db);
  myWords.add('homme');
  myWords.add('penser');
  const entries = { homme: toEntry(fixture('homme')), penser: toEntry(fixture('penser')) };
  const errors = [];
  const game = genreGame({
    myWords,
    dictionary: { definitions: async (word) => { if (word === 'cassé') throw new Error('Reverso responded 503'); return entries[word]; } },
    logger: { error: (...args) => errors.push(args) },
  });
  assert.equal(game.name, 'genre');
  assert.equal(game.flag, 'cahier-constructions');
  assert.deepEqual((await game.items()).items, [{ word: 'homme', item: '' }, { word: 'penser', item: '' }]);
  assert.equal((await game.cardOf({ word: 'homme', item: '' })).answer, 'un');
  assert.equal(await game.cardOf({ word: 'penser', item: '' }), null);
  assert.equal(await game.cardOf({ word: 'cassé', item: '' }), null);
  assert.equal(errors.length, 1);
});
