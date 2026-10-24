const ENDPOINT = 'https://definition-api.reverso.net/v1/api/definitions/fr/';
// Reverso splits Portuguese into 'pt' (Portugal) and 'bp' (Brazil).
const TARGET_LANG = 'bp';
const PARAMS = new URLSearchParams({
  targetLang: TARGET_LANG,
  wordExpressions: 'false',
  showRelated: 'false',
  showMainTranslations: 'false',
  showVocabularyLists: 'false',
  showNeighbors: '0',
});

export class UpstreamError extends Error {}

export async function fetchDefinition(word, { fetch = globalThis.fetch, timeoutMs = 10_000 } = {}) {
  const url = `${ENDPOINT}${encodeURIComponent(word)}?${PARAMS}`;
  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    throw new UpstreamError(`Reverso unreachable: ${err.message}`, { cause: err });
  }
  if (!res.ok) throw new UpstreamError(`Reverso responded ${res.status}`);
  return res.json();
}

const unique = (items) => [...new Set(items.filter(Boolean))];

function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter((item) => !seen.has(key(item)) && seen.add(key(item)));
}

const portugueseOf = (example) =>
  example.translations?.find((t) => t.lang === TARGET_LANG)?.translation.replace(/<em>(.*?)<\/em>/g, '**$1**') ?? null;

const toExamples = (examples = []) =>
  uniqueBy(
    examples.filter((e) => e.example).map((e) => ({ fr: e.example, pt: portugueseOf(e) })),
    (e) => e.fr,
  );

function toSense(def) {
  return {
    definition: def.Def,
    level: def.level ?? null,
    tags: def.tags ?? [],
    translations: unique((def.translations ?? []).filter((t) => t.lang === TARGET_LANG).map((t) => t.translation)),
    examples: toExamples(def.examples),
  };
}

export function toEntry(raw) {
  const words = (raw?.DefsByWord ?? [])
    .map((w) => ({
      word: w.word,
      ipa: w.pronounceIpa?.split(',')[0].trim() || null,
      sections: (w.DefsByPos ?? [])
        .map((p) => ({ pos: p.Pos, gender: p.gender ?? null, senses: (p.Defs ?? []).map(toSense) }))
        .filter((s) => s.senses.length > 0),
    }))
    .filter((w) => w.sections.length > 0);

  if (words.length === 0) return null;
  return { query: raw.OrigWord, words };
}

export const isVerb = (word) => word.sections.some((s) => s.pos === 'Verb');

export const headwordOf = (entry, word) => entry?.words.find((w) => w.word === word) ?? entry?.words[0];
