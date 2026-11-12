export const GAPS_IN_DAYS = [1, 3, 7, 14, 30, 60, 120];

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

/**
 * Whether the text is a real calendar day written YYYY-MM-DD.
 * @param {unknown} text
 * @returns {boolean}
 */
export function isDay(text) {
  if (typeof text !== 'string' || !DAY.test(text)) return false;
  const time = Date.parse(`${text}T00:00:00Z`);
  return !Number.isNaN(time) && new Date(time).toISOString().startsWith(text);
}

/**
 * @param {string} day YYYY-MM-DD
 * @param {number} days
 * @returns {string} the day that many days later, YYYY-MM-DD
 */
export function addDays(day, days) {
  return new Date(Date.parse(`${day}T00:00:00Z`) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

/**
 * @param {Date} [date]
 * @returns {string} the calendar day of the date where this code runs, YYYY-MM-DD
 */
export function localDay(date = new Date()) {
  const twoDigits = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
}

/**
 * Which gap an item takes after this answer: a first answer or a miss starts over at one day,
 * a hint keeps the gap, and a right answer moves one gap up until the last one.
 * @param {{ step: number } | undefined} previous the item's progress, undefined for a new item
 * @param {'right' | 'hinted' | 'wrong'} outcome
 * @returns {number} index in GAPS_IN_DAYS
 */
function stepAfter(previous, outcome) {
  if (!previous || outcome === 'wrong') return 0;
  if (outcome === 'hinted') return previous.step;
  return Math.min(previous.step + 1, GAPS_IN_DAYS.length - 1);
}

/**
 * When an item comes back after this answer.
 * @param {{ step: number } | undefined} previous the item's progress, undefined for a new item
 * @param {'right' | 'hinted' | 'wrong'} outcome
 * @param {string} today YYYY-MM-DD
 * @returns {{ step: number, dueOn: string }}
 */
export function nextReview(previous, outcome, today) {
  const step = stepAfter(previous, outcome);
  return { step, dueOn: addDays(today, GAPS_IN_DAYS[step]) };
}
