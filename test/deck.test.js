import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NEW_PER_DAY, buildSession, shuffleApart } from '../server/deck.js';
import { itemKey } from '../server/reviews.js';

const TODAY = '2026-11-12';
const TOMORROW = '2026-11-13';

const itemsOf = (words) => words.map((word) => ({ word, item: '' }));
const wordsFrom = (count, prefix = 'mot') => Array.from({ length: count }, (_, i) => `${prefix}${String(i).padStart(2, '0')}`);
const progressOf = (entries) => new Map(entries.map(([word, progress]) => [itemKey({ word, item: '' }), progress]));
const reviewed = (dueOn, { introducedOn = '2026-10-01', answered = 1 } = {}) => ({ step: 1, dueOn, introducedOn, answered });
const plainCard = async ({ word }) => ({ prompt: word });
const sorted = (cards) => cards.map(({ word }) => word).sort();

test('due items and new items make today’s cards', async () => {
  const session = await buildSession({
    items: itemsOf(['avant', 'retard', 'plus-tard', 'neuf', 'nouveau']),
    progress: progressOf([['avant', reviewed(TODAY)], ['retard', reviewed('2026-11-02')], ['plus-tard', reviewed('2026-11-15')]]),
    today: TODAY,
    cardOf: plainCard,
  });
  assert.deepEqual(sorted(session.cards), ['avant', 'neuf', 'nouveau', 'retard']);
  assert.equal(session.due, 2);
  assert.equal(session.fresh, 2);
  for (const card of session.cards) assert.deepEqual(card, { prompt: card.word, word: card.word, item: '' });
});

test('each card is built with its item’s progress', async () => {
  const seen = [];
  await buildSession({
    items: itemsOf(['avant', 'neuf']),
    progress: progressOf([['avant', reviewed(TODAY, { answered: 4 })]]),
    today: TODAY,
    cardOf: async (item, progress) => { seen.push([item.word, progress?.answered]); return {}; },
  });
  assert.deepEqual(seen.sort(), [['avant', 4], ['neuf', undefined]]);
});

test('new items are capped at 10 a day, minus those already started today', async () => {
  assert.equal(NEW_PER_DAY, 10);
  const unseen = wordsFrom(15);
  const startedToday = ['hier', 'matin', 'midi'];
  const session = await buildSession({
    items: itemsOf([...startedToday, ...unseen]),
    progress: progressOf(startedToday.map((word) => [word, reviewed(TOMORROW, { introducedOn: TODAY })])),
    today: TODAY,
    cardOf: plainCard,
  });
  assert.deepEqual(sorted(session.cards), unseen.slice(0, 7));
  assert.equal(session.fresh, 7);
});

test('asking twice without answering gives the same new items', async () => {
  const ask = (random) => buildSession({ items: itemsOf(wordsFrom(25)), progress: new Map(), today: TODAY, cardOf: plainCard, random });
  assert.deepEqual(sorted((await ask(() => 0.1)).cards), sorted((await ask(() => 0.9)).cards));
});

test('items whose card cannot be built are skipped and the next new item takes their place', async () => {
  const words = wordsFrom(12);
  const session = await buildSession({
    items: itemsOf(['vieux', ...words]),
    progress: progressOf([['vieux', reviewed(TODAY)]]),
    today: TODAY,
    cardOf: async ({ word }) => (word === 'vieux' || word === words[1] ? null : {}),
  });
  assert.deepEqual(sorted(session.cards), words.filter((word) => word !== words[1]).slice(0, 10));
  assert.equal(session.due, 0);
  assert.equal(session.fresh, 10);
});

test('nextDueOn is the soonest later due day, or null', async () => {
  const later = await buildSession({
    items: itemsOf(['a', 'b', 'c']),
    progress: progressOf([['a', reviewed('2026-11-20')], ['b', reviewed('2026-11-15')], ['c', reviewed(TODAY)]]),
    today: TODAY,
    cardOf: plainCard,
  });
  assert.equal(later.nextDueOn, '2026-11-15');
  const none = await buildSession({ items: itemsOf(['a']), progress: new Map(), today: TODAY, cardOf: plainCard });
  assert.equal(none.nextDueOn, null);
});

test('cards of the same word are kept apart when possible', () => {
  const items = [
    ...['à qqn', 'qqch de', 'que'].map((item) => ({ word: 'penser', item })),
    ...['de qqch', 'qqn'].map((item) => ({ word: 'parler', item })),
    { word: 'aller', item: 'à' },
  ];
  for (const seed of [0, 0.2, 0.5, 0.8, 0.99]) {
    const order = shuffleApart(items, (item) => item.word, () => seed);
    assert.equal(order.length, items.length);
    assert.deepEqual(new Set(order), new Set(items));
    order.slice(1).forEach((item, i) => assert.notEqual(item.word, order[i].word, `seed ${seed}: ${order.map((o) => o.word)}`));
  }
  const alone = [{ word: 'penser', item: 'à' }, { word: 'penser', item: 'de' }];
  assert.equal(shuffleApart(alone, (item) => item.word, Math.random).length, 2);
});
