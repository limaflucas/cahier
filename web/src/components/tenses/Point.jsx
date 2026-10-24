import Marked from '../Marked.jsx';

export default function Point({ point }) {
  return (
    <li>
      <h4 className="font-semibold text-stone-900">{point.title}</h4>
      {point.text && <p className="mt-1 text-stone-700"><Marked text={point.text} /></p>}
      {point.note && <p lang="pt" className="mt-1 text-sm text-blue-800">{point.note}</p>}
      {point.examples.length > 0 && (
        <ul className="mt-2 space-y-2 border-l-2 border-stone-200 pl-3">
          {point.examples.map(({ fr, pt }) => (
            <li key={fr}>
              <p lang="fr" className="font-serif text-stone-700"><Marked text={fr} /></p>
              <p lang="pt" className="text-sm text-blue-800">{pt}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
