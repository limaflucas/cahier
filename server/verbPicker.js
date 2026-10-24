import { levelWeight } from './levels.js';
import { weightedChoice } from './random.js';

const ADVANCED_BONUS = 3;

function verbSenses(entry, word) {
  return (entry?.words ?? [])
    .filter((w) => w.word === word)
    .flatMap((w) => w.sections)
    .filter((section) => section.pos === 'Verb')
    .flatMap((section) => section.senses);
}

export function verbWeight(entry, word) {
  if (!entry) return 1;
  const senses = verbSenses(entry, word);
  return senses.length === 0 ? 0 : levelWeight(senses, ADVANCED_BONUS);
}

export function createVerbPicker({ myWords, dictionary, conjugator, random = Math.random, logger = console }) {
  async function weightOf(word) {
    try {
      return verbWeight(await dictionary.definitions(word), word);
    } catch (err) {
      logger.error(`definitions for "${word}" failed:`, err.message);
      return 1;
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
