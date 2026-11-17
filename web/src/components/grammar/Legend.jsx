import { COMPLEMENTS } from '../../grammar/marks.js';
import Complements, { Swatch } from './Complements.jsx';

/**
 * What the two highlight colours stand for.
 * @param {{ items: { kind: 'COD' | 'COI', hint: string, pt: string }[] }} props
 */
export default function Legend({ items }) {
  return (
    <ul aria-label="Légende" className="space-y-3 text-sm">
      {items.map(({ kind, hint, pt }) => (
        <li key={kind}>
          <p>
            <Swatch kind={kind} /> <span className="font-medium text-stone-900">{COMPLEMENTS[kind]}</span>
          </p>
          <p className="mt-1 text-stone-600"><Complements text={hint} /></p>
          <p lang="pt" className="text-blue-800">{pt}</p>
        </li>
      ))}
    </ul>
  );
}
