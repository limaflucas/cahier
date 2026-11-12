/**
 * @param {Date} [date]
 * @returns {string} the learner's calendar day, YYYY-MM-DD
 */
export function localDay(date = new Date()) {
  const twoDigits = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
}
