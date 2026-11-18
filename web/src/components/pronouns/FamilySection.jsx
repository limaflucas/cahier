import { Link } from 'react-router-dom';
import { chapterUrl, clock } from '../../pronouns/index.js';
import Marked from '../Marked.jsx';
import Point from '../tenses/Point.jsx';
import Forms from './Forms.jsx';
import PickLink from './PickLink.jsx';
import { TINT, hueStyle } from './hue.js';

const LINK = 'font-medium text-blue-700 hover:text-blue-900';

/**
 * A titled list of points, or nothing when there are none.
 * @param {{ id: string, title: string, points: object[] }} props
 */
function Points({ id, title, points }) {
  if (points.length === 0) return null;
  return (
    <section aria-labelledby={id} className="mt-8">
      <h3 id={id} className="font-serif text-xl font-semibold text-stone-900">{title}</h3>
      <ul className="mt-4 space-y-6">
        {points.map((point) => <Point key={point.title} point={point} />)}
      </ul>
    </section>
  );
}

/**
 * Links to the COD et COI rules that go deeper, or nothing when there are none.
 * @param {{ id: string, links: { to: string, label: string }[] }} props
 */
function More({ id, links }) {
  if (links.length === 0) return null;
  return (
    <section aria-labelledby={id} className="mt-8">
      <h3 id={id} className="font-serif text-xl font-semibold text-stone-900">Pour aller plus loin</h3>
      <p className="mt-1 text-stone-700">
        Sur la fiche <Link to="/grammaire/cod-coi" className={LINK}>COD et COI</Link> de la Grammaire :
      </p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className={LINK}>{label} <span aria-hidden="true">→</span></Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * One pronoun family: summary, forms, uses and, when written, the B2–C1 nuances, pitfalls and tips.
 * @param {{ family: object, highlighted: string | null, onPick: (id: string, key?: string) => void }} props
 */
export default function FamilySection({ family, highlighted, onPick }) {
  const { id } = family;
  return (
    <section id={id} aria-labelledby={`${id}-title`} style={hueStyle(family.hue)} className="scroll-mt-6 border-t border-stone-200 pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`${id}-title`} tabIndex={-1} className="flex items-center gap-3 font-serif text-3xl font-semibold text-stone-900 focus:outline-none">
          <span aria-hidden="true" className={`size-3.5 shrink-0 rounded ${TINT}`} />
          {family.name}
        </h2>
        <a href={chapterUrl(family.chapter)} target="_blank" rel="noreferrer" className="text-sm whitespace-nowrap text-stone-500 hover:text-blue-700">
          ▶ Vidéo · {clock(family.chapter)}
        </a>
      </div>
      <p className="mt-2 text-lg text-stone-800">{family.summary.fr}</p>
      <p lang="pt" className="text-blue-800">{family.summary.pt}</p>

      <section aria-labelledby={`${id}-formes`} className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
        <h3 id={`${id}-formes`} className="mb-3 text-sm font-semibold text-stone-900">Formes</h3>
        <Forms family={family} highlighted={highlighted} />
      </section>

      <Points id={`${id}-emplois`} title="Emplois" points={family.uses} />
      <Points id={`${id}-avance`} title="Niveau B2–C1" points={family.advanced} />
      <Points id={`${id}-pieges`} title="Pièges pour lusophones" points={family.pitfalls} />

      {family.memory.length > 0 && (
        <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <h3 className="text-sm font-semibold text-stone-900">Pour retenir</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-stone-700 marker:text-amber-400">
            {family.memory.map((tip) => <li key={tip}><Marked text={tip} /></li>)}
          </ul>
        </aside>
      )}

      <More id={`${id}-plus`} links={family.more ?? []} />

      <p className="mt-6">
        <PickLink to="tableau" onPick={onPick} className="text-sm font-medium text-blue-700 hover:text-blue-900">↑ Tableau</PickLink>
      </p>
    </section>
  );
}
