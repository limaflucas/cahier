import { COMPLEMENTS, frenchSpacing, parseMarks } from '../../grammar/marks.js';

const MARK = 'rounded-sm underline decoration-2 underline-offset-4 box-decoration-clone';
const COLOURS = {
  COD: 'bg-sky-100 text-sky-950 decoration-sky-600',
  COI: 'bg-orange-100 text-orange-950 decoration-orange-500 decoration-dashed',
};

/**
 * A complement kind in its colour, as the legend and the table headers show it.
 * @param {{ kind: 'COD' | 'COI' }} props
 */
export function Swatch({ kind }) {
  return <span className={`${MARK} px-1 font-semibold ${COLOURS[kind]}`}>{kind}</span>;
}

/**
 * French text with French spacing, its bold parts, and its COD and COI highlighted, each named on hover and for
 * screen readers.
 * @param {{ text: string }} props
 */
export default function Complements({ text }) {
  return parseMarks(text).map(({ text: raw, kind, strong }, index) => {
    const part = frenchSpacing(raw);
    if (kind) {
      return (
        <mark key={index} title={COMPLEMENTS[kind]} className={`${MARK} ${COLOURS[kind]}`}>
          {part}
          <span className="sr-only"> ({kind})</span>
        </mark>
      );
    }
    if (strong) return <strong key={index} className="font-semibold text-stone-900">{part}</strong>;
    return part;
  });
}
