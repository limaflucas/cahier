import { toEntry, isVerb } from './reverso.js';
import { summarizeWord } from './wordSummary.js';

const MAX_ENTRIES = 5000;
const REVALIDATE_MS = 1000;

export const normalize = (word) => word.normalize('NFC').trim().toLowerCase();

/**
 * Freezes a value and everything it holds, so readers sharing it cannot change it.
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

/**
 * Parsed dictionary entries kept in memory, least recently used first out.
 * They are dropped whenever another connection, such as a maintenance script, writes the database.
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {{ maxEntries: number, now: () => number }} options
 * @returns {{ get(query: string): object | undefined, set(query: string, entry: object): void }}
 */
function createEntryMemory(db, { maxEntries, now }) {
  const entries = new Map();
  const dataVersion = db.prepare('PRAGMA data_version');
  let version = dataVersion.get().data_version;
  let checkedAt = now();

  /** Forgets every entry once another connection has written the database, checking at most once a second. */
  function forgetIfDatabaseChanged() {
    if (now() - checkedAt < REVALIDATE_MS) return;
    checkedAt = now();
    const current = dataVersion.get().data_version;
    if (current !== version) entries.clear();
    version = current;
  }

  /**
   * @param {string} query
   * @param {object} entry
   */
  function set(query, entry) {
    entries.delete(query);
    entries.set(query, deepFreeze(entry));
    if (entries.size > maxEntries) entries.delete(entries.keys().next().value);
  }

  /**
   * @param {string} query
   * @returns {object | undefined}
   */
  function get(query) {
    forgetIfDatabaseChanged();
    const entry = entries.get(query);
    if (entry) set(query, entry);
    return entry;
  }

  return { get, set };
}

/**
 * The French dictionary: Reverso entries cached in SQLite and kept parsed in memory, plus verb prepositions.
 * @param {object} deps
 * @param {import('node:sqlite').DatabaseSync} deps.db
 * @param {(query: string) => Promise<object>} deps.fetchDefinition fetches a raw Reverso reply
 * @param {((verb: string) => Promise<object[]>) | null} [deps.findPrepositions]
 * @param {number} [deps.maxEntries] parsed entries kept in memory
 * @param {() => number} [deps.now] clock, in milliseconds
 */
export function createDictionary({
  db, fetchDefinition, findPrepositions = null, logger = console, maxEntries = MAX_ENTRIES, now = Date.now,
}) {
  const getRaw = db.prepare('SELECT json FROM reverso_cache WHERE query = ?');
  const getRaws = db.prepare('SELECT query, json FROM reverso_cache WHERE query IN (SELECT value FROM json_each(?))');
  const putRaw = db.prepare('INSERT OR REPLACE INTO reverso_cache (query, json) VALUES (?, ?)');
  const getPreps = db.prepare('SELECT json FROM preposition_cache WHERE verb = ?');
  const getManyPreps = db.prepare('SELECT verb, json FROM preposition_cache WHERE verb IN (SELECT value FROM json_each(?))');
  const putPreps = db.prepare('INSERT OR REPLACE INTO preposition_cache (verb, json) VALUES (?, ?)');
  const isSaved = db.prepare('SELECT 1 FROM my_words WHERE word = ?');
  const memory = createEntryMemory(db, { maxEntries, now });

  async function rawFor(query) {
    const cached = getRaw.get(query);
    if (cached) return JSON.parse(cached.json);
    const raw = await fetchDefinition(query);
    if (toEntry(raw)) putRaw.run(query, JSON.stringify(raw));
    return raw;
  }

  /**
   * The parsed entry for a normalized query: from memory, else the Reverso cache, else Reverso.
   * @param {string} query
   * @returns {Promise<object | null>}
   */
  async function entryFor(query) {
    const remembered = memory.get(query);
    if (remembered) return remembered;
    const entry = toEntry(await rawFor(query));
    if (entry) memory.set(query, entry);
    return entry;
  }

  /**
   * Asks Claude for the verb's prepositions and caches them in place of any cached before.
   * @param {string} verb
   * @returns {Promise<object[] | null>} null when Claude is not set up or failed
   */
  async function findAndCachePrepositions(verb) {
    if (!findPrepositions) return null;
    try {
      const constructions = await findPrepositions(verb);
      putPreps.run(verb, JSON.stringify(constructions));
      return constructions;
    } catch (err) {
      logger.error(`prepositions for "${verb}" failed:`, err.message);
      return null;
    }
  }

  async function prepositionsFor(verb) {
    const cached = getPreps.get(verb);
    return cached ? JSON.parse(cached.json) : findAndCachePrepositions(verb);
  }

  const PENDING = 'pending';
  const searches = new Map();

  /**
   * Searches for the verb's prepositions in the background, once however often it is asked.
   * @param {string} verb
   * @returns {Promise<object[] | null>}
   */
  function searchPrepositions(verb) {
    if (!searches.has(verb)) searches.set(verb, prepositionsFor(verb).finally(() => searches.delete(verb)));
    return searches.get(verb);
  }

  /**
   * The verb's prepositions when known, else 'pending' while a background search finds them.
   * @param {string} verb
   * @returns {object[] | null | 'pending'}
   */
  function prepositionsSoFar(verb) {
    const cached = getPreps.get(verb);
    if (cached) return JSON.parse(cached.json);
    if (!findPrepositions) return null;
    searchPrepositions(verb);
    return PENDING;
  }

  async function definitions(word) {
    const query = normalize(word);
    return query ? entryFor(query) : null;
  }

  return {
    definitions,

    /**
     * Reads the cached entries of these words into memory in one query, never fetching.
     * @param {string[]} words
     */
    preload(words) {
      for (const { query, json } of getRaws.all(JSON.stringify(words.map(normalize)))) {
        const entry = toEntry(JSON.parse(json));
        if (entry) memory.set(query, entry);
      }
    },

    summary: async (word) => summarizeWord(await definitions(word), normalize(word)),

    /**
     * The word's entry, each headword flagged when saved and, for verbs, given its prepositions.
     * @param {string} word
     * @param {{ awaitPrepositions?: boolean }} [options] false: verbs whose prepositions are still unknown
     *   get 'pending' at once, and `prepositions(verb)` delivers them when found
     * @returns {Promise<object | null>}
     */
    async lookup(word, { awaitPrepositions = true } = {}) {
      const entry = await definitions(word);
      if (!entry) return null;

      const prepositionsOf = awaitPrepositions ? prepositionsFor : prepositionsSoFar;
      const words = await Promise.all(
        entry.words.map(async (w) => ({
          ...w,
          saved: Boolean(isSaved.get(w.word)),
          prepositions: isVerb(w) ? await prepositionsOf(w.word) : undefined,
        })),
      );
      return { ...entry, words };
    },

    /**
     * The verb's prepositions, waiting for a search a lookup started; never starts one.
     * @param {string} verb
     * @returns {Promise<object[] | null | undefined>} null when unavailable, undefined when no lookup asked
     */
    async prepositions(verb) {
      const cached = getPreps.get(verb);
      return cached ? JSON.parse(cached.json) : searches.get(verb);
    },

    /**
     * The verb's prepositions if already found; never searches or waits for a search.
     * @param {string} verb
     * @returns {object[] | null}
     */
    knownPrepositions(verb) {
      const cached = getPreps.get(verb);
      return cached ? JSON.parse(cached.json) : null;
    },

    /**
     * The cached prepositions of these verbs, read in one query; verbs never searched are left out.
     * @param {string[]} verbs
     * @returns {Map<string, object[]>}
     */
    cachedPrepositions(verbs) {
      return new Map(getManyPreps.all(JSON.stringify(verbs)).map(({ verb, json }) => [verb, JSON.parse(json)]));
    },

    refreshPrepositions: findAndCachePrepositions,
  };
}
