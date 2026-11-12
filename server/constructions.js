const BLANK = /_{2,}/g;

/**
 * A sentence as compared with another: apostrophes, the spaces after them and runs of spaces do not matter.
 * @param {string} text
 * @returns {string}
 */
const comparable = (text) => text.normalize('NFC').replace(/[’‘]/g, "'").replace(/'\s+/g, "'").replace(/\s+/g, ' ').trim();

/**
 * Whether a construction can be drilled: its gap has a single blank, and its answer in the blank gives back its example.
 * @param {{ gap?: string, answer?: string, example: string }} construction
 * @returns {boolean}
 */
export function isDrillable({ gap, answer, example }) {
  if (typeof gap !== 'string' || typeof answer !== 'string' || gap.match(BLANK)?.length !== 1) return false;
  return comparable(gap.replace(BLANK, () => answer)) === comparable(example);
}

/**
 * Whether a verb's constructions must be asked for again: none were ever cached, or they predate gap sentences.
 * @param {object[] | undefined} constructions
 * @returns {boolean}
 */
export const needsRefresh = (constructions) => !constructions || constructions.some(({ gap }) => gap === undefined);

/**
 * A Prépositions card: the preposition to put in the gap, then the construction and how Portuguese says it.
 * @param {{ gap: string, answer: string, pattern: string, meaning: string, portuguese: string,
 *   differsFromPortuguese: boolean, example: string }} construction
 * @returns {object}
 */
export const prepositionCard = ({ gap, answer, pattern, meaning, portuguese, differsFromPortuguese, example }) =>
  ({ sentence: gap, answer, pattern, meaning, portuguese, differsFromPortuguese, example });

/**
 * The verb's drillable constructions as game items, one per pattern.
 * @param {string} verb
 * @param {object[]} constructions
 * @returns {{ word: string, item: string, construction: object }[]}
 */
function drillsOf(verb, constructions) {
  const patterns = new Set();
  return constructions
    .filter((construction) => isDrillable(construction) && !patterns.has(construction.pattern) && patterns.add(construction.pattern))
    .map((construction) => ({ word: verb, item: construction.pattern, construction }));
}

/**
 * Asks again, in the background and one verb at a time, for constructions that predate gap sentences.
 * Each verb is asked at most once while the server runs, so Claude is never asked twice for nothing.
 * @param {{ dictionary: { refreshPrepositions(verb: string): Promise<object[] | null> }, logger?: Console }} deps
 */
export function createConstructionRefresher({ dictionary, logger = console }) {
  const asked = new Set();
  const waiting = [];
  let working = false;

  /** Refreshes the waiting verbs in turn until none is left. */
  async function work() {
    working = true;
    while (waiting.length > 0) {
      try {
        await dictionary.refreshPrepositions(waiting[0]);
      } catch (err) {
        logger.error(`refreshing the constructions of "${waiting[0]}" failed:`, err.message);
      }
      waiting.shift();
    }
    working = false;
  }

  return {
    /**
     * @param {string[]} verbs verbs whose constructions need a refresh
     * @returns {number} how many of them are still waiting for it
     */
    refresh(verbs) {
      for (const verb of verbs.filter((verb) => !asked.has(verb))) {
        asked.add(verb);
        waiting.push(verb);
      }
      if (!working && waiting.length > 0) work();
      return verbs.filter((verb) => waiting.includes(verb)).length;
    },
  };
}

/**
 * Prépositions: type the preposition of a saved verb's construction, then see how Portuguese says it.
 * @param {object} deps
 * @param {ReturnType<typeof import('./myWords.js').createMyWords>} deps.myWords
 * @param {{ cachedPrepositions(verbs: string[]): Map<string, object[]> }} deps.dictionary
 * @param {{ isVerb(word: string): boolean }} deps.conjugator
 * @param {ReturnType<typeof createConstructionRefresher>} deps.refresher
 */
export function prepositionsGame({ myWords, dictionary, conjugator, refresher }) {
  return {
    name: 'prepositions',
    flag: 'cahier-constructions',

    /** @returns {Promise<{ items: object[], preparing: number }>} preparing: saved verbs whose constructions are on their way */
    async items() {
      const verbs = myWords.list().map(({ word }) => word).filter((word) => conjugator.isVerb(word));
      const cached = dictionary.cachedPrepositions(verbs);
      const ready = verbs.filter((verb) => !needsRefresh(cached.get(verb)));
      return {
        items: ready.flatMap((verb) => drillsOf(verb, cached.get(verb))),
        preparing: refresher.refresh(verbs.filter((verb) => needsRefresh(cached.get(verb)))),
      };
    },

    /**
     * @param {{ construction: object }} item
     * @returns {Promise<object>}
     */
    cardOf: async ({ construction }) => prepositionCard(construction),
  };
}
