import personnels from './personnels.js';
import toniques from './toniques.js';
import possessifs from './possessifs.js';
import demonstratifs from './demonstratifs.js';
import neutres from './neutres.js';
import reflechis from './reflechis.js';
import codCoi from './codCoi.js';
import enY from './enY.js';
import relatifs from './relatifs.js';
import interrogatifs from './interrogatifs.js';
import indefinis from './indefinis.js';

export const FAMILIES = [
  personnels,
  toniques,
  possessifs,
  demonstratifs,
  neutres,
  reflechis,
  codCoi,
  enY,
  relatifs,
  interrogatifs,
  indefinis,
];

export const FAMILIES_BY_ID = Object.fromEntries(FAMILIES.map((family) => [family.id, family]));

export const VIDEO_URL = 'https://www.youtube.com/watch?v=Puhiz1gRaOc';

/**
 * The video, started at a chapter.
 * @param {number} seconds
 * @returns {string}
 */
export const chapterUrl = (seconds) => `${VIDEO_URL}&t=${seconds}s`;

/**
 * A video timestamp: 44:00, 1:07:49.
 * @param {number} seconds
 * @returns {string}
 */
export function clock(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = String(seconds % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`;
}

/**
 * Every form of a family once, in the order its Formes box shows them.
 * @param {object} family
 * @returns {{ key: string, form: string, elided?: string }[]}
 */
export function formsOf(family) {
  const all = 'list' in family.forms ? family.forms.list : family.forms.rows.flatMap(({ cells }) => cells.flat());
  const seen = new Set();
  return all.filter(({ key }) => !seen.has(key) && seen.add(key));
}
