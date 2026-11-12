import { normalize } from './dictionary.js';

const fold = (word) => normalize(word).normalize('NFD').replace(/\p{Diacritic}/gu, '');

/**
 * The words the learner saved.
 * @param {import('node:sqlite').DatabaseSync} db
 */
export function createMyWords(db) {
  const list = db.prepare('SELECT word, added_at AS addedAt FROM my_words ORDER BY added_at DESC, word');
  const add = db.prepare('INSERT OR IGNORE INTO my_words (word) VALUES (?)');
  const remove = db.prepare('DELETE FROM my_words WHERE word = ?');

  return {
    list: () => list.all().map((row) => ({ ...row })),
    add: (word) => void add.run(word),
    remove: (word) => void remove.run(word),

    /**
     * The saved word spelled like this one, ignoring case and accents; its exact spelling wins.
     * @param {string} word
     * @returns {{ word: string, addedAt: string } | null}
     */
    find(word) {
      const wanted = fold(word);
      if (!wanted) return null;
      const alike = list.all().filter((row) => fold(row.word) === wanted);
      const found = alike.find((row) => row.word === normalize(word)) ?? alike[0];
      return found ? { ...found } : null;
    },
  };
}
