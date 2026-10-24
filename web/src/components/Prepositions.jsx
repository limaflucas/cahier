import Gloss from './Gloss.jsx';

export default function Prepositions({ constructions }) {
  return (
    <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
      <h2 className="border-b border-amber-200 pb-1 text-sm font-semibold text-stone-900">prépositions</h2>
      {constructions === null ? (
        <p className="mt-4 text-sm text-stone-500">Indisponibles pour le moment.</p>
      ) : constructions.length === 0 ? (
        <p className="mt-4 text-sm text-stone-600">Ce verbe ne se construit pas avec une préposition.</p>
      ) : (
        <ol className="mt-4 list-decimal space-y-5 pl-6">
          {constructions.map(({ pattern, meaning, example }, i) => (
            <Gloss key={i} text={pattern} translation={meaning} examples={[example]} />
          ))}
        </ol>
      )}
    </section>
  );
}
