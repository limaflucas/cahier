const STORAGE_KEY = 'recherche.recentes';
const MAX_SEARCHES = 5;

export function withSearch(searches, word) {
  const key = word.toLowerCase();
  return [word, ...searches.filter((search) => search.toLowerCase() !== key)].slice(0, MAX_SEARCHES);
}

export function readRecentSearches() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored.filter((search) => typeof search === 'string').slice(0, MAX_SEARCHES) : [];
  } catch {
    return [];
  }
}

export function rememberSearch(word) {
  const searches = withSearch(readRecentSearches(), word);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  } catch {
    // Search history is a convenience; private browsing may refuse storage.
  }
  return searches;
}
