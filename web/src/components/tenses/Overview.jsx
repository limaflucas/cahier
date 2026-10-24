import { TENSES_BY_ID, TWIN_TENSES } from '../../tenses/index.js';
import { DERIVATIONS, REPORTED_SPEECH, SI_CLAUSES, STUDY_TIPS, TIMELINE } from '../../tenses/overview.js';
import Marked from '../Marked.jsx';

const nameOf = (id) => TENSES_BY_ID[id].name;

function TenseLink({ id }) {
  return (
    <a href={`#${id}`} className="font-serif text-stone-900 underline decoration-stone-300 underline-offset-2 hover:text-blue-700 hover:decoration-blue-700">
      {nameOf(id)}
    </a>
  );
}

function OverviewBlock({ title, children }) {
  return (
    <section className="mt-10">
      <h3 className="font-serif text-xl font-semibold text-stone-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Timeline() {
  return (
    <ol className="relative grid gap-4 sm:grid-cols-5 sm:gap-2">
      <span aria-hidden="true" className="absolute inset-x-[10%] top-2 hidden h-px bg-stone-300 sm:block" />
      {TIMELINE.map(({ tenses, moment, now }) => (
        <li key={moment} className="relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
          <span
            aria-hidden="true"
            className={`mt-0.5 size-4 shrink-0 rounded-full border-2 sm:mt-0 ${now ? 'border-blue-700 bg-blue-700' : 'border-stone-400 bg-stone-50'}`}
          />
          <div>
            <p className="space-x-2 sm:space-x-0">
              {tenses.map((id) => (
                <span key={id} className="sm:block"><TenseLink id={id} /></span>
              ))}
            </p>
            <p className={`text-xs ${now ? 'font-medium text-blue-700' : 'text-stone-500'}`}>{moment}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Overview() {
  return (
    <section id="vue-d-ensemble" aria-labelledby="vue-d-ensemble-title" className="scroll-mt-6">
      <h2 id="vue-d-ensemble-title" className="font-serif text-3xl font-semibold text-stone-900">Vue d'ensemble</h2>

      <OverviewBlock title="La ligne du temps">
        <Timeline />
        <p className="mt-6 text-stone-700">
          Chaque temps composé exprime une action <strong className="font-semibold text-stone-900">achevée avant</strong> son
          temps simple jumeau : on forme l'un avec l'auxiliaire conjugué à l'autre.
        </p>
        <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {TWIN_TENSES.map(([simple, compound]) => (
            <li key={simple}>
              <TenseLink id={simple} /> <span className="text-stone-500">et</span> <TenseLink id={compound} />
            </li>
          ))}
        </ul>
      </OverviewBlock>

      <OverviewBlock title="D'où viennent les formes">
        <p className="text-stone-700">
          Quatre formes suffisent à reconstruire presque toute la conjugaison. Dans le jeu, ces liens s'allument quand vous
          remplissez une case.
        </p>
        <dl className="mt-4 space-y-4">
          {DERIVATIONS.map(({ source, targets, example }) => (
            <div key={source} className="grid gap-1 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <dt className="font-semibold text-stone-900">{source}</dt>
              <dd>
                <p className="flex flex-wrap gap-x-3 gap-y-1">
                  {targets.map((id) => <TenseLink key={id} id={id} />)}
                </p>
                <p lang="fr" className="mt-1 font-serif text-sm text-stone-600"><Marked text={example} /></p>
              </dd>
            </div>
          ))}
        </dl>
      </OverviewBlock>

      <OverviewBlock title="Les phrases avec « si »">
        <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {SI_CLAUSES.map(({ condition, consequence, example, pt }) => (
            <li key={condition} className="grid gap-1 p-4 sm:grid-cols-[11rem_13rem_1fr] sm:gap-4">
              <p className="font-semibold text-stone-900">{condition}</p>
              <p className="text-stone-700">{consequence}</p>
              <div>
                <p lang="fr" className="font-serif text-stone-700"><Marked text={example} /></p>
                <p lang="pt" className="text-sm text-blue-800">{pt}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-stone-600">Jamais de futur ni de conditionnel juste après « si ».</p>
      </OverviewBlock>

      <OverviewBlock title="Le discours indirect au passé">
        <p className="text-stone-700">Après un verbe introducteur au passé (il a dit, elle pensait), les temps reculent d'un cran.</p>
        <ul className="mt-3 space-y-2">
          {REPORTED_SPEECH.map(({ direct, reported, shift }) => (
            <li key={shift} className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-4">
              <p className="text-sm text-stone-500">{shift}</p>
              <p lang="fr" className="font-serif text-stone-700">
                <Marked text={direct} /> <span className="text-stone-400">devient</span> <Marked text={reported} />
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-stone-600">L'imparfait, le plus-que-parfait et le conditionnel ne changent pas.</p>
      </OverviewBlock>

      <OverviewBlock title="Bien mémoriser">
        <ul className="list-disc space-y-2 pl-5 text-stone-700 marker:text-stone-300">
          {STUDY_TIPS.map((tip) => <li key={tip}><Marked text={tip} /></li>)}
        </ul>
      </OverviewBlock>
    </section>
  );
}
