import { Link } from 'react-router-dom';
import Marked from '../Marked.jsx';
import Formation from './Formation.jsx';
import ModelConjugations from './ModelConjugations.jsx';
import Point from './Point.jsx';

function Points({ title, points }) {
  if (points.length === 0) return null;
  return (
    <section className="mt-8">
      <h3 className="font-serif text-xl font-semibold text-stone-900">{title}</h3>
      <ul className="mt-4 space-y-6">
        {points.map((point) => <Point key={point.title} point={point} />)}
      </ul>
    </section>
  );
}

export default function TenseSection({ tense, models }) {
  return (
    <section id={tense.id} aria-labelledby={`${tense.id}-title`} className="scroll-mt-6 border-t border-stone-200 pt-10">
      <h2 id={`${tense.id}-title`} className="font-serif text-3xl font-semibold text-stone-900">{tense.name}</h2>
      <p className="mt-2 text-lg text-stone-800">{tense.summary.fr}</p>
      <p lang="pt" className="text-blue-800">{tense.summary.pt}</p>

      <div className="mt-6 space-y-4">
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-stone-900">Formation</h3>
          <Formation formation={tense.formation} />
        </section>
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-stone-900">Modèles</h3>
          {models.status === 'done' && <ModelConjugations tense={tense} boards={models.data} />}
          {models.status === 'loading' && <p className="text-sm text-stone-500">Chargement des modèles…</p>}
          {models.status === 'error' && <p className="text-sm text-stone-500">Modèles indisponibles pour le moment.</p>}
        </section>
      </div>

      <Points title="Emplois" points={tense.uses} />
      <Points title="Niveau B2–C1" points={tense.advanced} />
      <Points title="Pièges pour lusophones" points={tense.pitfalls} />

      <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
        <h3 className="text-sm font-semibold text-stone-900">Pour retenir</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-stone-700 marker:text-amber-400">
          {tense.memory.map((tip) => <li key={tip}><Marked text={tip} /></li>)}
        </ul>
      </aside>

      <p className="mt-6">
        <Link to="/conjugaison" className="text-sm font-medium text-blue-700 hover:text-blue-900">
          S'entraîner sur un verbe
        </Link>
      </p>
    </section>
  );
}
