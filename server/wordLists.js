const MAX_NAME_LENGTH = 60;
const EMOJI = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;
const graphemes = new Intl.Segmenter('fr', { granularity: 'grapheme' });

/** A list that cannot be saved; `code` says why. */
export class ListError extends Error {
  /**
   * @param {'invalid_name' | 'name_taken' | 'invalid_emoji'} code
   */
  constructor(code) {
    super(code);
    this.code = code;
  }
}

/**
 * The form two names share when they clash: no accents, no case.
 * @param {string} name
 * @returns {string}
 */
const nameKey = (name) => name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('fr');

/**
 * @param {unknown} name
 * @returns {string} the trimmed name
 */
function validName(name) {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (trimmed.length === 0 || [...trimmed].length > MAX_NAME_LENGTH) throw new ListError('invalid_name');
  return trimmed;
}

/**
 * @param {unknown} emoji
 * @returns {string | null} the emoji, or null for none
 */
function validEmoji(emoji) {
  if (emoji === null || emoji === undefined || emoji === '') return null;
  const isOneEmoji = typeof emoji === 'string' && [...graphemes.segment(emoji)].length === 1 && EMOJI.test(emoji);
  if (!isOneEmoji) throw new ListError('invalid_emoji');
  return emoji;
}

/**
 * @param {{ id: number, name: string, emoji: string | null, createdAt: string }} row
 * @returns {{ id: number, name: string, emoji: string | null, createdAt: string, wordCount: number }}
 */
const toList = (row) => ({ id: row.id, name: row.name, emoji: row.emoji, createdAt: row.createdAt, wordCount: 0 });

/**
 * Named word lists ("sacs"), each with an optional emoji.
 * @param {import('node:sqlite').DatabaseSync} db
 */
export function createWordLists(db) {
  const columns = 'id, name, emoji, created_at AS createdAt';
  const all = db.prepare(`SELECT ${columns} FROM word_lists ORDER BY created_at DESC, id DESC`);
  const get = db.prepare(`SELECT ${columns} FROM word_lists WHERE id = ?`);
  const insert = db.prepare('INSERT INTO word_lists (name, name_key, emoji) VALUES (?, ?, ?)');
  const rename = db.prepare('UPDATE word_lists SET name = ?, name_key = ? WHERE id = ?');
  const setEmoji = db.prepare('UPDATE word_lists SET emoji = ? WHERE id = ?');
  const remove = db.prepare('DELETE FROM word_lists WHERE id = ?');

  /**
   * Runs a write, reporting a clashing name as `name_taken`.
   * @param {() => void} write
   */
  function guardingNames(write) {
    try {
      write();
    } catch (err) {
      if (err.code === 'ERR_SQLITE_ERROR' && /UNIQUE constraint failed: word_lists\.name_key/.test(err.message)) {
        throw new ListError('name_taken');
      }
      throw err;
    }
  }

  /**
   * @param {number} id
   * @returns {ReturnType<typeof toList> | null}
   */
  const find = (id) => {
    const row = get.get(id);
    return row ? toList(row) : null;
  };

  return {
    /**
     * @returns {ReturnType<typeof toList>[]} newest first, the later id first on ties
     */
    all: () => all.all().map(toList),

    get: find,

    /**
     * @param {{ name?: unknown, emoji?: unknown }} fields
     */
    create({ name, emoji } = {}) {
      const trimmed = validName(name);
      const chosen = validEmoji(emoji);
      let id;
      guardingNames(() => {
        id = Number(insert.run(trimmed, nameKey(trimmed), chosen).lastInsertRowid);
      });
      return find(id);
    },

    /**
     * @param {number} id
     * @param {{ name?: unknown, emoji?: unknown }} fields only those present change
     */
    update(id, fields) {
      if (!find(id)) return null;
      const trimmed = 'name' in fields ? validName(fields.name) : null;
      const chosen = 'emoji' in fields ? validEmoji(fields.emoji) : undefined;
      if (trimmed !== null) guardingNames(() => rename.run(trimmed, nameKey(trimmed), id));
      if (chosen !== undefined) setEmoji.run(chosen, id);
      return find(id);
    },

    /**
     * @param {number} id
     * @returns {boolean} whether a list was removed
     */
    remove: (id) => remove.run(id).changes > 0,
  };
}
