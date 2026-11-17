import { levelWeight, sensesWeight } from './levels.js';
import { weightedChoice } from './random.js';

function verbSenses(entry, word) {
  return (entry?.words ?? [])
    .filter((w) => w.word === word)
    .flatMap((w) => w.sections)
    .filter((section) => section.pos === 'Verb')
    .flatMap((section) => section.senses);
}

/**
 * How likely the verb is to be drawn: the average weight of its verb meanings, 0 when the dictionary lists none,
 * and the weight of unlevelled content when the dictionary has no entry for it.
 * @param {object | null} entry the verb's dictionary entry
 * @param {string} word
 * @returns {number}
 */
export function verbWeight(entry, word) {
  return entry ? sensesWeight(verbSenses(entry, word)) : levelWeight(null);
}

export function createVerbPicker({ myWords, dictionary, conjugator, random = Math.random, logger = console }) {
  /**
   * @param {string} word
   * @returns {Promise<number>} the verb's weight, that of unlevelled content when the dictionary fails
   */
  async function weightOf(word) {
    try {
      return verbWeight(await dictionary.definitions(word), word);
    } catch (err) {
      logger.error(`definitions for "${word}" failed:`, err.message);
      return levelWeight(null);
    }
  }

  return {
    async pick({ exclude } = {}) {
      const verbs = myWords.list().map(({ word }) => word).filter(conjugator.isVerb);
      const weights = await Promise.all(verbs.map(weightOf));
      const usable = verbs.map((verb, i) => ({ value: verb, weight: weights[i] })).filter(({ weight }) => weight > 0);
      const candidates = usable.length > 1 ? usable.filter(({ value }) => value !== exclude) : usable;
      return candidates.length > 0 ? weightedChoice(candidates, random) : null;
    },
  };
}
