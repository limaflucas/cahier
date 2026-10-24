import { posLabel } from '../labels.js';
import LevelBadge from './LevelBadge.jsx';

export default function KeyMeanings({ meanings, showPos }) {
  if (meanings === null) return <p className="mt-1 text-sm text-stone-500">Sens indisponibles pour le moment.</p>;
  if (meanings.length === 0) return null;
  return (
    <ol className="mt-2 space-y-2">
      {meanings.map(({ pos, level, definition, translations }) => (
        <li key={`${pos}:${definition}`} className="grid grid-cols-[2.25rem_1fr] gap-x-2">
          <span className="pt-0.5">{level && <LevelBadge level={level} />}</span>
          <div>
            <p lang="fr" className="text-stone-800">
              {showPos && <span className="text-xs italic text-stone-500">{posLabel(pos)} </span>}
              {definition}
            </p>
            {translations.length > 0 && (
              <p lang="pt" className="text-sm font-medium text-blue-800">{translations.join(', ')}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
