export default function Gloss({ text, translation, examples, children }) {
  return (
    <li className="pl-1 marker:font-semibold marker:text-stone-400">
      {children}
      <p lang="fr" className="mt-1 text-stone-900">{text}</p>
      {translation && <p lang="pt" className="mt-0.5 font-medium text-blue-800">{translation}</p>}
      {examples.length > 0 && (
        <ul lang="fr" className="mt-2 space-y-1 border-l-2 border-stone-200 pl-3 font-serif italic text-stone-600">
          {examples.map((example) => <li key={example}>{example}</li>)}
        </ul>
      )}
    </li>
  );
}
