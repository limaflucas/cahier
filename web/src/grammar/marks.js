export const COMPLEMENTS = {
  COD: "complément d'objet direct",
  COI: "complément d'objet indirect",
};

const TOKEN = /\{(\w+):([^{}]*)\}|\*\*([^*]+)\*\*/g;
const STRAY = /[{}]|\*\*/;

/**
 * French spacing: a no-break space before ? ! : ; » and after «, so they never start or end a line on their own.
 * @param {string} text
 * @returns {string}
 */
export const frenchSpacing = (text) => text.replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');

/**
 * Splits a French text into plain parts, bold parts (`**…**`) and marked complements (`{COD:…}`, `{COI:…}`).
 * @param {string} text
 * @returns {{ text: string, kind?: 'COD' | 'COI', strong?: true }[]}
 * @throws {SyntaxError} when a mark is unknown, empty, nested or left open
 */
export function parseMarks(text) {
  const malformed = () => new SyntaxError(`Malformed marks in: ${text}`);
  const parts = [];
  const pushPlain = (plain) => {
    if (STRAY.test(plain)) throw malformed();
    if (plain) parts.push({ text: plain });
  };

  let end = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, kind, complement, strong] = match;
    pushPlain(text.slice(end, match.index));
    if (strong !== undefined) {
      if (STRAY.test(strong)) throw malformed();
      parts.push({ text: strong, strong: true });
    } else {
      if (!COMPLEMENTS[kind] || !complement.trim() || STRAY.test(complement)) throw malformed();
      parts.push({ text: complement, kind });
    }
    end = match.index + whole.length;
  }
  pushPlain(text.slice(end));
  return parts;
}
