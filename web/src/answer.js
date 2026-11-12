const APOSTROPHES = /[’‘`´]/g;

/**
 * An answer as typed, folded for comparison: case, apostrophes and spacing do not matter.
 * @param {string} text
 * @returns {string}
 */
export const normalizeAnswer = (text) =>
  text
    .normalize('NFC')
    .toLowerCase()
    .replace(APOSTROPHES, "'")
    .replace(/\s*'\s*/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/**
 * @param {string} text
 * @returns {string} the text without its accents
 */
export const withoutAccents = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').normalize('NFC');
