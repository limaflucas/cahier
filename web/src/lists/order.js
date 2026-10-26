const STORAGE_KEY = 'sacs.ordre';
const ORDERS = ['date', 'alpha'];
const french = new Intl.Collator('fr', { sensitivity: 'base' });

/**
 * @typedef {{ id: number, name: string, emoji: string | null, createdAt: string, wordCount: number }} List
 */

/**
 * The lists in the chosen order, leaving the input untouched.
 * @param {List[]} lists
 * @param {'date' | 'alpha'} order newest first, or A→Z in French order
 * @returns {List[]}
 */
export function sortLists(lists, order) {
  const byDate = (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
  const byName = (a, b) => french.compare(a.name, b.name);
  return [...lists].sort(order === 'alpha' ? byName : byDate);
}

/**
 * @returns {'date' | 'alpha'} the order chosen last time, by date when none was
 */
export function readListsOrder() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return ORDERS.includes(saved) ? saved : 'date';
  } catch {
    return 'date';
  }
}

/**
 * @param {'date' | 'alpha'} order
 */
export function saveListsOrder(order) {
  try {
    localStorage.setItem(STORAGE_KEY, order);
  } catch {
    // Remembering the order is a convenience; private browsing may refuse storage.
  }
}

/**
 * @param {number} n
 * @returns {string} « 0 mot », « 1 mot », « 2 mots »
 */
export const wordCountLabel = (n) => `${n} ${n > 1 ? 'mots' : 'mot'}`;
