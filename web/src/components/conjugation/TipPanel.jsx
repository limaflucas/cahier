import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tenseAnchor } from '../../tenses/index.js';
import Formation from '../tenses/Formation.jsx';

export default function TipPanel({ id, tense, hints }) {
  const [showVerbHints, setShowVerbHints] = useState(false);
  return (
    <div id={id} className="mt-3 space-y-3 rounded-lg bg-amber-50 p-3 text-sm">
      <Formation formation={tense.formation} compact />
      {hints.length > 0 &&
        (showVerbHints ? (
          <div>
            <p className="font-semibold text-stone-900">Pour ce verbe</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-stone-700 marker:text-amber-400">
              {hints.map((hint) => <li key={hint} lang="fr">{hint}</li>)}
            </ul>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowVerbHints(true)}
            className="rounded-md border border-amber-300 bg-white px-2.5 py-1 font-medium text-stone-800 hover:bg-amber-100"
          >
            Aide pour ce verbe
          </button>
        ))}
      <Link to={tenseAnchor(tense.id)} target="_blank" className="inline-block font-medium text-blue-700 hover:text-blue-900">
        Voir la fiche « {tense.name} »
      </Link>
    </div>
  );
}
