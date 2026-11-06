import { useId } from 'react';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import Gloss from './Gloss.jsx';

const PENDING = 'pending';

/**
 * The verb's constructions, or why there are none.
 * @param {{ constructions: object[] | null }} props null when they are unavailable
 */
function Constructions({ constructions }) {
  if (constructions === null) return <p className="mt-4 text-sm text-stone-500">Indisponibles pour le moment.</p>;
  if (constructions.length === 0) {
    return <p className="mt-4 text-sm text-stone-600">Ce verbe ne se construit pas avec une préposition.</p>;
  }
  return (
    <ol className="mt-4 list-decimal space-y-5 pl-6">
      {constructions.map(({ pattern, meaning, example }, i) => (
        <Gloss key={i} text={pattern} translation={meaning} examples={[example]} />
      ))}
    </ol>
  );
}

/**
 * Waits for the constructions the server is still searching for.
 * @param {{ verb: string }} props
 */
function PendingConstructions({ verb }) {
  const state = useApi((signal) => api.prepositions(verb, signal), [verb]);
  if (state.status === 'loading') return <p className="mt-4 text-sm text-stone-500">Recherche des prépositions…</p>;
  return <Constructions constructions={state.status === 'done' ? state.data : null} />;
}

/**
 * The verb's prepositional constructions.
 * @param {{ verb: string, constructions: object[] | null | 'pending' }} props
 */
export default function Prepositions({ verb, constructions }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <h2 id={headingId} className="border-b border-amber-200 pb-1 text-sm font-semibold text-stone-900">prépositions</h2>
      {constructions === PENDING ? <PendingConstructions verb={verb} /> : <Constructions constructions={constructions} />}
    </section>
  );
}
