import { shuffle } from './random.js';
import { itemKey } from './reviews.js';

export const NEW_PER_DAY = 10;

/**
 * Orders the items at random, never putting two of the same group side by side unless nothing else is left.
 * @template T
 * @param {T[]} items
 * @param {(item: T) => string} groupOf
 * @param {() => number} random
 * @returns {T[]}
 */
export function shuffleApart(items, groupOf, random) {
  const groups = new Map();
  for (const item of shuffle(items, random)) groups.set(groupOf(item), [...(groups.get(groupOf(item)) ?? []), item]);

  const order = [];
  let previous;
  while (groups.size > 0) {
    const others = [...groups.keys()].filter((group) => group !== previous);
    const largest = (others.length > 0 ? others : [previous])
      .reduce((most, group) => (groups.get(group).length > groups.get(most).length ? group : most));
    order.push(groups.get(largest).shift());
    if (groups.get(largest).length === 0) groups.delete(largest);
    previous = largest;
  }
  return order;
}

/**
 * @param {{ word: string, item: string }} item
 * @param {object | undefined} progress
 * @param {(item: object, progress: object | undefined) => Promise<object | null>} cardOf
 * @returns {Promise<object | null>} the item's card, labelled with the item, or null when none can be built
 */
async function labelledCard(item, progress, cardOf) {
  const card = await cardOf(item, progress);
  return card && { ...card, word: item.word, item: item.item };
}

/**
 * The cards of the first items that have one, at most `count`.
 * @param {{ word: string, item: string }[]} items in order of priority
 * @param {number} count
 * @param {(item: object, progress: undefined) => Promise<object | null>} cardOf
 * @returns {Promise<object[]>}
 */
async function firstCards(items, count, cardOf) {
  const cards = [];
  for (const item of items) {
    if (cards.length >= count) break;
    const card = await labelledCard(item, undefined, cardOf);
    if (card) cards.push(card);
  }
  return cards;
}

/**
 * Today's cards of one game: every item due by today, plus new items up to the day's allowance,
 * which the new items already started today use up. The same day always gets the same new items.
 * @param {object} options
 * @param {{ word: string, item: string }[]} options.items every item of the game, in the order new ones come in
 * @param {Map<string, { dueOn: string, introducedOn: string }>} options.progress by itemKey
 * @param {string} options.today YYYY-MM-DD
 * @param {(item: object, progress: object | undefined) => Promise<object | null>} options.cardOf
 * @param {() => number} [options.random]
 * @returns {Promise<{ cards: object[], due: number, fresh: number, nextDueOn: string | null }>}
 */
export async function buildSession({ items, progress, today, cardOf, random = Math.random }) {
  const progressOf = (item) => progress.get(itemKey(item));
  const due = items.filter((item) => progressOf(item)?.dueOn <= today);
  const unseen = items.filter((item) => !progressOf(item));
  const startedToday = [...progress.values()].filter(({ introducedOn }) => introducedOn === today).length;

  const dueCards = (await Promise.all(due.map((item) => labelledCard(item, progressOf(item), cardOf)))).filter(Boolean);
  const freshCards = await firstCards(unseen, NEW_PER_DAY - startedToday, cardOf);
  const laterDays = items.map(progressOf).filter((p) => p?.dueOn > today).map(({ dueOn }) => dueOn).sort();

  return {
    cards: shuffleApart([...dueCards, ...freshCards], (card) => card.word, random),
    due: dueCards.length,
    fresh: freshCards.length,
    nextDueOn: laterDays[0] ?? null,
  };
}
