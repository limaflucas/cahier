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
