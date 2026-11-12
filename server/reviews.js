import { nextReview } from './schedule.js';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS reviews (
    game TEXT NOT NULL,
    word TEXT NOT NULL REFERENCES my_words (word) ON DELETE CASCADE,
    item TEXT NOT NULL DEFAULT '',
    step INTEGER NOT NULL,
    due_on TEXT NOT NULL,
    introduced_on TEXT NOT NULL,
    answered INTEGER NOT NULL,
    PRIMARY KEY (game, word, item)
  );
`;

/**
 * What tells one item of a game from another: its saved word, and which part of it (empty for the word itself).
 * @param {{ word: string, item: string }} item
 * @returns {string}
 */
export const itemKey = ({ word, item }) => JSON.stringify([word, item]);

/**
 * Where each item of each game stands on the review schedule. Removing a word from Mes mots forgets its items.
 * @param {import('node:sqlite').DatabaseSync} db
 */
export function createReviews(db) {
  db.exec(SCHEMA);
  const ofGame = db.prepare('SELECT word, item, step, due_on, introduced_on, answered FROM reviews WHERE game = ?');
  const stepOf = db.prepare('SELECT step FROM reviews WHERE game = ? AND word = ? AND item = ?');
  const saveOfSavedWord = db.prepare(`
    INSERT INTO reviews (game, word, item, step, due_on, introduced_on, answered)
    SELECT :game, word, :item, :step, :dueOn, :today, 1 FROM my_words WHERE word = :word
    ON CONFLICT (game, word, item) DO UPDATE SET step = excluded.step, due_on = excluded.due_on, answered = answered + 1
  `);

  return {
    /**
     * @param {string} game
     * @returns {Map<string, { step: number, dueOn: string, introducedOn: string, answered: number }>} by itemKey
     */
    progress(game) {
      return new Map(ofGame.all(game).map((row) => [
        itemKey(row),
        { step: row.step, dueOn: row.due_on, introducedOn: row.introduced_on, answered: row.answered },
      ]));
    },

    /**
     * Moves an item along the schedule after the learner answered it.
     * @param {string} game
     * @param {{ word: string, item: string }} item
     * @param {'right' | 'hinted' | 'wrong'} outcome
     * @param {string} today YYYY-MM-DD
     * @returns {{ step: number, dueOn: string } | null} when it comes back; null when the word is not saved
     */
    record(game, { word, item }, outcome, today) {
      const next = nextReview(stepOf.get(game, word, item), outcome, today);
      const { changes } = saveOfSavedWord.run({ game, word, item, step: next.step, dueOn: next.dueOn, today });
      return changes > 0 ? next : null;
    },
  };
}
