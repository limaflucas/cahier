const fold = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

export function matchesSearch(word, query) {
  const wanted = fold(query);
  if (!wanted) return true;
  const folded = fold(word);
  return folded.startsWith(wanted) || folded.split(/[\s'’-]+/).some((part) => part.startsWith(wanted));
}
