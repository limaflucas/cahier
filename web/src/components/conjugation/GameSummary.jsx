function Count({ value, label, className }) {
  return (
    <div>
      <dt className="text-sm text-stone-600">{label}</dt>
      <dd className={`font-serif text-3xl font-semibold ${className}`}>{value}</dd>
    </div>
  );
}

export default function GameSummary({ score, onReplay, onNextVerb }) {
  return (
    <section aria-live="polite" className="rounded-xl border border-stone-200 bg-white p-5">
      <h2 className="font-serif text-2xl font-semibold text-stone-900">
        {score.complete ? 'Tout est juste, bravo !' : 'Partie terminée'}
      </h2>
      <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
        <Count value={score.firstTry} label="du premier coup" className="text-emerald-700" />
        <Count value={score.afterRetry} label="après correction" className="text-amber-700" />
        <Count value={score.revealed} label="révélées" className="text-stone-500" />
      </dl>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={onReplay} className="rounded-full bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800">
          Rejouer ce verbe
        </button>
        <button type="button" onClick={onNextVerb} className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm font-medium text-stone-800 hover:bg-stone-100">
          Autre verbe de mes mots
        </button>
      </div>
    </section>
  );
}
