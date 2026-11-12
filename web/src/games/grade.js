import { normalizeAnswer, withoutAccents } from '../answer.js';

/**
 * How a typed Rappel answer compares with the form the sentence uses and with the dictionary form.
 * @param {string} input
 * @param {{ answer: string, word: string }} card
 * @returns {'empty' | 'correct' | 'lemma' | 'accent' | 'wrong'} lemma: the dictionary form instead of the sentence's;
 *   accent: right but for its accents
 */
export function gradeRecall(input, { answer, word }) {
  const typed = normalizeAnswer(input);
  if (!typed) return 'empty';
  const [expected, lemma] = [answer, word].map(normalizeAnswer);
  if (typed === expected) return 'correct';
  if (typed === lemma) return 'lemma';
  const looselyTyped = withoutAccents(typed);
  return [expected, lemma].some((form) => withoutAccents(form) === looselyTyped) ? 'accent' : 'wrong';
}

const UNCONTRACTED = { au: 'à', aux: 'à', du: 'de', des: 'de', "d'": 'de' };
const CONTRACTIONS = { au: 'à + le = au', aux: 'à + les = aux', du: 'de + le = du', des: 'de + les = des', "d'": "de + voyelle = d'" };

/**
 * @param {string} answer a preposition as a sentence writes it
 * @returns {string | null} how it is contracted or elided, e.g. "à + le = au"; null when it is not
 */
export const contractionOf = (answer) => CONTRACTIONS[normalizeAnswer(answer)] ?? null;

/**
 * How a typed preposition compares with the one the sentence uses; '' stands for no preposition.
 * @param {string} input
 * @param {string} answer
 * @returns {'correct' | 'contraction' | 'accent' | 'wrong'} contraction: right, but before contracting or eliding it
 */
export function gradePreposition(input, answer) {
  const [typed, expected] = [input, answer].map(normalizeAnswer);
  if (typed === expected) return 'correct';
  if (withoutAccents(typed) === withoutAccents(expected)) return 'accent';
  const uncontracted = UNCONTRACTED[expected];
  return uncontracted && withoutAccents(typed) === withoutAccents(uncontracted) ? 'contraction' : 'wrong';
}
