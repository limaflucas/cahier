import Complements from './Complements.jsx';

/**
 * French examples, each with its Portuguese translation.
 * @param {{ examples: { fr: string, pt: string }[] }} props
 */
export default function Examples({ examples }) {
  return (
    <ul className="mt-3 space-y-2 border-l-2 border-stone-200 pl-3">
      {examples.map(({ fr, pt }) => (
        <li key={fr}>
          <p lang="fr" className="font-serif text-stone-700"><Complements text={fr} /></p>
          <p lang="pt" className="text-sm text-blue-800">{pt}</p>
        </li>
      ))}
    </ul>
  );
}
