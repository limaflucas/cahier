export function createMyWords(db) {
  const list = db.prepare('SELECT word, added_at AS addedAt FROM my_words ORDER BY added_at DESC, word');
  const add = db.prepare('INSERT OR IGNORE INTO my_words (word) VALUES (?)');
  const remove = db.prepare('DELETE FROM my_words WHERE word = ?');

  return {
    list: () => list.all().map((row) => ({ ...row })),
    add: (word) => void add.run(word),
    remove: (word) => void remove.run(word),
  };
}
