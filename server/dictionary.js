import { toEntry, isVerb } from './reverso.js';
import { summarizeWord } from './wordSummary.js';

export const normalize = (word) => word.normalize('NFC').trim().toLowerCase();

export function createDictionary({ db, fetchDefinition, findPrepositions = null, logger = console }) {
  const getRaw = db.prepare('SELECT json FROM reverso_cache WHERE query = ?');
  const putRaw = db.prepare('INSERT OR REPLACE INTO reverso_cache (query, json) VALUES (?, ?)');
  const getPreps = db.prepare('SELECT json FROM preposition_cache WHERE verb = ?');
  const putPreps = db.prepare('INSERT OR REPLACE INTO preposition_cache (verb, json) VALUES (?, ?)');
  const isSaved = db.prepare('SELECT 1 FROM my_words WHERE word = ?');

  async function rawFor(query) {
    const cached = getRaw.get(query);
    if (cached) return JSON.parse(cached.json);
    const raw = await fetchDefinition(query);
    if (toEntry(raw)) putRaw.run(query, JSON.stringify(raw));
    return raw;
  }

  async function prepositionsFor(verb) {
    const cached = getPreps.get(verb);
    if (cached) return JSON.parse(cached.json);
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

  async function definitions(word) {
    const query = normalize(word);
    return query ? toEntry(await rawFor(query)) : null;
  }

  return {
    definitions,

    summary: async (word) => summarizeWord(await definitions(word), normalize(word)),

    async lookup(word) {
      const entry = await definitions(word);
      if (!entry) return null;

      const words = await Promise.all(
        entry.words.map(async (w) => ({
          ...w,
          saved: Boolean(isSaved.get(w.word)),
          prepositions: isVerb(w) ? await prepositionsFor(w.word) : undefined,
        })),
      );
      return { ...entry, words };
    },
  };
}
