const foldApostrophes = (text) => text.replace(/[’‘]/g, "'");
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function inflectionsOf(word) {
  if (/[\s']/.test(word)) return [word];
  const endings = /(?:au|eu|ou)$/.test(word) ? ['s', 'x'] : ['s', 'e', 'es'];
  return [word, ...endings.map((ending) => word + ending)];
}

export function markWord(text, forms) {
  const alternatives = [...new Set(forms.map((form) => foldApostrophes(form.normalize('NFC'))))]
    .sort((a, b) => b.length - a.length)
    .map((form) => escape(form).replace(/ +/g, '\\s+'));
  if (alternatives.length === 0) return null;
  const original = text.normalize('NFC');
  const match = new RegExp(`(?<!\\p{L})(?:${alternatives.join('|')})(?!\\p{L})`, 'iu').exec(foldApostrophes(original));
  if (!match) return null;
  const end = match.index + match[0].length;
  return `${original.slice(0, match.index)}**${original.slice(match.index, end)}**${original.slice(end)}`;
}
