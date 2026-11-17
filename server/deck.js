import { createHash } from 'node:crypto';
import { shuffle } from './random.js';
import { itemKey } from './reviews.js';

export const NEW_PER_DAY = 10;
export const DRAWN_FROM = 30;

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
 * @param {string} text
 * @returns {number} a number in (0, 1) that depends only on the text, so a draw made with it can be made again
 */
function steadyRandom(text) {
  return (createHash('sha256').update(text).digest().readUIntBE(0, 6) + 0.5) / 2 ** 48;
}

/**
 * The cards of today's new items, drawn by weight and without replacement (Efraimidis–Spirakis: each item ranks
 * by ln(u) / weight) among the DRAWN_FROM newest items that have a card and were not seen before today.
 * Items started today keep their place among them, and the draw depends only on the game and the day,
 * so asking again gives what is left of the same draw.
 * @param {object} options
 * @param {{ word: string, item: string }[]} options.items newest first
 * @param {(item: object) => { introducedOn: string } | undefined} options.progressOf
 * @param {string} options.today YYYY-MM-DD
 * @param {(item: object, progress: undefined) => Promise<object | null>} options.cardOf
 * @param {(item: object) => Promise<number>} options.weightOf
 * @param {string} options.seed tells one game's draw from another's
 * @param {number} options.room how many more new items today allows
 * @returns {Promise<object[]>}
 */
async function drawnCards({ items, progressOf, today, cardOf, weightOf, seed, room }) {
  const drawn = [];
  let places = DRAWN_FROM;
  for (const item of items) {
    if (places === 0) break;
    const progress = progressOf(item);
    if (progress) {
      if (progress.introducedOn === today) places--;
      continue;
    }
    const card = await labelledCard(item, undefined, cardOf);
    if (!card) continue;
    places--;
    drawn.push({ card, rank: Math.log(steadyRandom(`${seed}\n${today}\n${itemKey(item)}`)) / (await weightOf(item)) });
  }
  return drawn.sort((a, b) => b.rank - a.rank || 0).slice(0, Math.max(room, 0)).map(({ card }) => card);
}

/**
 * Today's cards of one game: every item due by today, plus the day's draw of new items up to the day's
 * allowance, which the new items already started today use up. The same day always gets the same new items.
 * @param {object} options
 * @param {{ word: string, item: string }[]} options.items every item of the game, newest first
 * @param {Map<string, { dueOn: string, introducedOn: string }>} options.progress by itemKey
 * @param {string} options.today YYYY-MM-DD
 * @param {(item: object, progress: object | undefined) => Promise<object | null>} options.cardOf
 * @param {(item: object) => Promise<number>} [options.weightOf] how likely a new item is to be drawn, all alike by default
 * @param {string} [options.seed] tells one game's draw from another's
 * @param {() => number} [options.random]
 * @returns {Promise<{ cards: object[], due: number, fresh: number, nextDueOn: string | null }>}
 */
export async function buildSession({ items, progress, today, cardOf, weightOf = async () => 1, seed = '', random = Math.random }) {
  const progressOf = (item) => progress.get(itemKey(item));
  const due = items.filter((item) => progressOf(item)?.dueOn <= today);
  const startedToday = [...progress.values()].filter(({ introducedOn }) => introducedOn === today).length;

  const dueCards = (await Promise.all(due.map((item) => labelledCard(item, progressOf(item), cardOf)))).filter(Boolean);
  const freshCards = await drawnCards({ items, progressOf, today, cardOf, weightOf, seed, room: NEW_PER_DAY - startedToday });
  const laterDays = items.map(progressOf).filter((p) => p?.dueOn > today).map(({ dueOn }) => dueOn).sort();

  return {
    cards: shuffleApart([...dueCards, ...freshCards], (card) => card.word, random),
    due: dueCards.length,
    fresh: freshCards.length,
    nextDueOn: laterDays[0] ?? null,
  };
}
