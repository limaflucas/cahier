/**
 * The dictionary sections of the verb being conjugated, as the search page shows them.
 * @param {{ words: { word: string, sections: object[] }[] } | null} entry a dictionary lookup
 * @param {string} verb
 * @returns {object[]}
 */
export function verbSections(entry, verb) {
  const words = entry?.words ?? [];
  return (words.find((w) => w.word === verb) ?? words[0])?.sections ?? [];
}
