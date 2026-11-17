import { Link } from 'react-router-dom';
import codCoi from '../grammar/codCoi.js';
import { COMPLEMENTS } from '../grammar/marks.js';
import { useScrollToHash } from '../useScrollToHash.js';
import LevelBadge from '../components/LevelBadge.jsx';
import Complements, { Swatch } from '../components/grammar/Complements.jsx';
import Examples from '../components/grammar/Examples.jsx';
import Legend from '../components/grammar/Legend.jsx';
import Rule from '../components/grammar/Rule.jsx';

const PARTS = {
  whatTheyAre: { id: 'ce-que-c-est', title: "Ce que c'est" },
  spotting: { id: 'les-reperer', title: 'Les repérer' },
  basics: { id: 'regles-de-base', title: 'Règles de base' },
  advanced: { id: 'niveau-b2-c1', title: 'Niveau B2–C1' },
  pitfalls: { id: 'pieges-pour-lusophones', title: 'Pièges pour lusophones' },
};

/** The page's table of contents, one link per part. */
function TableOfContents() {
  return (
    <nav aria-label="Sommaire" className="text-sm">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 lg:block lg:space-y-1">
        {Object.values(PARTS).map(({ id, title }) => (
          <li key={id}>
            <a href={`#${id}`} className="text-stone-700 hover:text-blue-700">{title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * One part of the page, with its anchor, its title and an optional introduction.
 * @param {{ part: { id: string, title: string }, intro?: string, children: import('react').ReactNode }} props
 */
function Part({ part, intro, children }) {
  return (
    <section
      id={part.id}
      aria-labelledby={`${part.id}-title`}
      className="scroll-mt-6 border-t border-stone-200 pt-10 first:border-t-0 first:pt-0"
    >
      <h2 id={`${part.id}-title`} className="font-serif text-3xl font-semibold text-stone-900">{part.title}</h2>
      {intro && <p className="mt-2 text-lg text-stone-700"><Complements text={intro} /></p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * A complement kind: what it is and the shapes it takes.
 * @param {{ definition: { kind: 'COD' | 'COI', text: string, pt: string, forms: object[] } }} props
 */
function Definition({ definition }) {
  const titleId = `definition-${definition.kind.toLowerCase()}`;
  return (
    <section aria-labelledby={titleId} className="rounded-xl border border-stone-200 bg-white p-4">
      <h3 id={titleId} className="font-semibold text-stone-900">
        <Swatch kind={definition.kind} /> {COMPLEMENTS[definition.kind]}
      </h3>
      <p className="mt-2 text-stone-700"><Complements text={definition.text} /></p>
      <p lang="pt" className="mt-1 text-sm text-blue-800">{definition.pt}</p>
      <h4 className="mt-4 text-xs font-medium text-stone-500">Il peut être</h4>
      <ul className="mt-2 space-y-2">
        {definition.forms.map(({ label, fr, pt }) => (
          <li key={label}>
            <p className="text-xs text-stone-500">{label}</p>
            <p lang="fr" className="font-serif text-stone-700"><Complements text={fr} /></p>
            <p lang="pt" className="text-sm text-blue-800">{pt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Something that looks like a COD or a COI, and the test that tells it apart.
 * @param {{ lookalike: { title: string, text: string, test: string, examples: object[] } }} props
 */
function Lookalike({ lookalike }) {
  return (
    <li>
      <h4 className="font-semibold text-stone-900"><Complements text={lookalike.title} /></h4>
      <p className="mt-1 text-stone-700"><Complements text={lookalike.text} /></p>
      <p className="mt-2 text-sm text-stone-700">
        <span className="font-semibold text-stone-900">Le test : </span>
        <Complements text={lookalike.test} />
      </p>
      <Examples examples={lookalike.examples} />
    </li>
  );
}

/** What a COD and a COI are, and what only looks like one. */
function WhatTheyAre() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {codCoi.definitions.map((definition) => <Definition key={definition.kind} definition={definition} />)}
      </div>
      <p className="mt-6 text-stone-700"><Complements text={codCoi.portuguese.fr} /></p>
      <p lang="pt" className="mt-1 text-sm text-blue-800">{codCoi.portuguese.pt}</p>

      <section aria-labelledby="ressemblances-title" className="mt-10">
        <h3 id="ressemblances-title" className="font-serif text-xl font-semibold text-stone-900">Ce qui leur ressemble</h3>
        <p className="mt-2 text-stone-700"><Complements text={codCoi.intros.lookalikes} /></p>
        <ul className="mt-6 space-y-8">
          {codCoi.lookalikes.map((lookalike) => <Lookalike key={lookalike.title} lookalike={lookalike} />)}
        </ul>
      </section>
    </>
  );
}

/** The four-step method, then examples climbing from A2 to C1. */
function Spotting() {
  return (
    <>
      <section aria-labelledby="methode-title" className="rounded-xl border border-stone-200 bg-white p-4">
        <h3 id="methode-title" className="text-sm font-semibold text-stone-900">La méthode</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-stone-700 marker:font-semibold marker:text-stone-400">
          {codCoi.method.map((step) => <li key={step}><Complements text={step} /></li>)}
        </ol>
      </section>

      <h3 className="mt-10 font-serif text-xl font-semibold text-stone-900">Du A2 au C1</h3>
      <ol aria-label="Exemples" className="mt-2 divide-y divide-stone-200">
        {codCoi.examples.map(({ level, fr, question, pt }) => (
          <li key={fr} className="flex gap-3 py-4">
            <span className="shrink-0 pt-1"><LevelBadge level={level} /></span>
            <div className="min-w-0">
              <p lang="fr" className="font-serif text-lg text-stone-800"><Complements text={fr} /></p>
              <p lang="fr" className="mt-1 text-sm text-stone-600"><Complements text={question} /></p>
              <p lang="pt" className="mt-1 text-sm text-blue-800">{pt}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/**
 * The rules of one part, each in its own anchored section.
 * @param {{ rules: object[] }} props
 */
function Rules({ rules }) {
  return <div className="space-y-12">{rules.map((rule) => <Rule key={rule.id} rule={rule} />)}</div>;
}

/**
 * Verbs that French and Portuguese build differently, with the pronoun French takes.
 * @param {{ group: { title: string, verbs: { fr: string, pronoun: string, pt: string }[] } }} props
 */
function VerbTable({ group }) {
  return (
    <section aria-label={group.title} className="mt-8 first:mt-0">
      <h3 className="font-serif text-xl font-semibold text-stone-900">{group.title}</h3>
      <div className="mt-3 overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-stone-500">
              <th scope="col" className="px-3 py-2 font-medium">Français</th>
              <th scope="col" className="px-3 py-2 font-medium">Pronom</th>
              <th scope="col" className="px-3 py-2 font-medium">Português</th>
            </tr>
          </thead>
          <tbody>
            {group.verbs.map(({ fr, pronoun, pt }) => (
              <tr key={fr} className="border-t border-stone-100 align-top">
                <th scope="row" lang="fr" className="px-3 py-2 text-left font-serif font-normal text-stone-900">{fr}</th>
                <td lang="fr" className="px-3 py-2 font-serif text-stone-700"><Complements text={pronoun} /></td>
                <td lang="pt" className="px-3 py-2 text-blue-800">{pt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Where Portuguese leads French astray. */
function Pitfalls() {
  return (
    <>
      {codCoi.pitfalls.groups.map((group) => <VerbTable key={group.title} group={group} />)}
      <ul className="mt-10 space-y-6">
        {codCoi.pitfalls.points.map(({ title, note, examples }) => (
          <li key={title}>
            <h3 className="font-semibold text-stone-900"><Complements text={title} /></h3>
            <p lang="pt" className="mt-1 text-sm text-blue-800">{note}</p>
            <Examples examples={examples} />
          </li>
        ))}
      </ul>
    </>
  );
}

/** The tips to keep in mind. */
function Memory() {
  return (
    <aside aria-labelledby="pour-retenir-title" className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <h2 id="pour-retenir-title" className="text-sm font-semibold text-stone-900">Pour retenir</h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-stone-700 marker:text-amber-400">
        {codCoi.memory.map((tip) => <li key={tip}><Complements text={tip} /></li>)}
      </ul>
    </aside>
  );
}

/** The COD and COI reference page. */
export default function CodCoi() {
  useScrollToHash();

  return (
    <>
      <header className="max-w-2xl">
        <Link to="/grammaire" className="text-sm font-medium text-blue-700 hover:text-blue-900">Grammaire</Link>
        <h1 className="mt-1 font-serif text-4xl font-semibold text-stone-900">{codCoi.title}</h1>
        <p className="mt-3 text-lg text-stone-700"><Complements text={codCoi.summary.fr} /></p>
        <p lang="pt" className="mt-1 text-blue-800">{codCoi.summary.pt}</p>
      </header>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <aside>
          <div className="space-y-8 lg:sticky lg:top-6">
            <TableOfContents />
            <Legend items={codCoi.legend} />
          </div>
        </aside>
        <div className="max-w-3xl space-y-14">
          <Part part={PARTS.whatTheyAre}><WhatTheyAre /></Part>
          <Part part={PARTS.spotting} intro={codCoi.intros.spotting}><Spotting /></Part>
          <Part part={PARTS.basics} intro={codCoi.intros.basics}><Rules rules={codCoi.basics} /></Part>
          <Part part={PARTS.advanced} intro={codCoi.intros.advanced}><Rules rules={codCoi.advanced} /></Part>
          <Part part={PARTS.pitfalls} intro={codCoi.intros.pitfalls}><Pitfalls /></Part>
          <Memory />
        </div>
      </div>
    </>
  );
}
