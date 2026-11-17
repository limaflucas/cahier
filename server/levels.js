const LADDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const FAVOURED = { from: LADDER.indexOf('B1'), to: LADDER.indexOf('C1') };
const SPREAD = 0.5;

/**
 * How likely content of a CEFR level is to be picked, from 0 to 1. B1 to C1 weigh 1, and the weight of the
 * levels around them falls off like a normal curve of standard deviation SPREAD: e^-2 for A2 and C2, e^-8 for A1.
 * Rare and unlevelled content weighs as C2.
 * @param {string | null | undefined} level
 * @returns {number}
 */
export function levelWeight(level) {
  const rank = LADDER.includes(level) ? LADDER.indexOf(level) : LADDER.indexOf('C2');
  const distance = Math.max(FAVOURED.from - rank, 0, rank - FAVOURED.to);
  return Math.exp(-(distance ** 2) / (2 * SPREAD ** 2));
}

/**
 * The weight of a word through its meanings: their average weight, 0 without any.
 * @param {{ level: string | null }[]} senses
 * @returns {number}
 */
export const sensesWeight = (senses) =>
  senses.length === 0 ? 0 : senses.reduce((sum, { level }) => sum + levelWeight(level), 0) / senses.length;
