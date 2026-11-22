const NEGATION = /((?<=^|\s)(?:ne(?=\s)|n'|pas(?=\s|$)))/;

/**
 * A negative form cut around ne, n' and pas, so they can stand out.
 * @param {string} form a negative form, such as "n'ai pas parlé"
 * @returns {{ text: string, negation: boolean }[]}
 */
export function negationParts(form) {
  return form
    .split(NEGATION)
    .map((text, index) => ({ text, negation: index % 2 === 1 }))
    .filter(({ text }) => text);
}
