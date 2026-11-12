export const REVIEW_DELAY = 3;

/**
 * @param {{ word: string, item: string }} card
 * @returns {string} what tells the card from the others of the session
 */
const keyOf = ({ word, item }) => JSON.stringify([word, item]);

/**
 * A review session over today's cards, in the order given.
 * @param {object[]} cards
 * @returns {{ queue: object[], answered: string[], rightFirstTime: number, total: number, turn: number }}
 *   turn: how many answers were given, so that a card coming back starts afresh
 */
export const newSession = (cards) => ({ queue: cards, answered: [], rightFirstTime: 0, total: cards.length, turn: 0 });

/**
 * @param {ReturnType<typeof newSession>} session
 * @returns {object | null} the card to answer now, null once the session is over
 */
export const currentCard = (session) => session.queue[0] ?? null;

/**
 * @param {ReturnType<typeof newSession>} session
 * @returns {boolean} whether every card was answered right once
 */
export const isFinished = (session) => session.queue.length === 0;

/**
 * Answers the current card: a right or hinted answer takes it out, a miss brings it back three cards later.
 * @param {ReturnType<typeof newSession>} session
 * @param {'right' | 'hinted' | 'wrong'} outcome
 * @returns {{ session: ReturnType<typeof newSession>, first: boolean }} first: whether this was the card's
 *   first answer, the only one the schedule records
 */
export function answerCard(session, outcome) {
  const [card, ...rest] = session.queue;
  const first = !session.answered.includes(keyOf(card));
  const queue = outcome === 'wrong' ? [...rest.slice(0, REVIEW_DELAY), card, ...rest.slice(REVIEW_DELAY)] : rest;
  return {
    first,
    session: {
      queue,
      answered: first ? [...session.answered, keyOf(card)] : session.answered,
      rightFirstTime: session.rightFirstTime + (first && outcome === 'right' ? 1 : 0),
      total: session.total,
      turn: session.turn + 1,
    },
  };
}
