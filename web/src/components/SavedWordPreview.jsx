import Classifications from './Classifications.jsx';
import KeyMeanings from './KeyMeanings.jsx';

/**
 * The saved word the search names, with its key meanings and first prepositions; choosing it opens its page.
 * @param {{
 *   id: string,
 *   saved: { word: string, summary: object | null, prepositions: { pattern: string, meaning: string }[] },
 *   onChoose: (word: string) => void,
 * }} props
 */
export default function SavedWordPreview({ id, saved, onChoose }) {
  const { word, summary, prepositions } = saved;
  return (
    <div
      id={id}
      role="listbox"
      aria-label="Dans mes mots"
      onMouseDown={(e) => e.preventDefault()}
      className="absolute inset-x-0 top-full z-20 mt-1 max-h-[70vh] overflow-y-auto rounded-lg border border-stone-200 bg-white shadow-lg"
    >
      <div
        id={`${id}-0`}
        role="option"
        aria-selected="true"
        aria-label={word}
        onClick={() => onChoose(word)}
        className="cursor-pointer px-4 py-3 hover:bg-stone-50"
      >
        <div className="flex items-baseline justify-between gap-4">
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span lang="fr" className="font-serif text-xl text-stone-900">{word}</span>
            {summary && <Classifications classifications={summary.classifications} />}
          </p>
          <span className="shrink-0 text-xs text-stone-400">Dans mes mots</span>
        </div>
        <KeyMeanings meanings={summary?.meanings ?? null} showPos={summary?.classifications.length > 1} />
        {prepositions.length > 0 && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2">
            <p className="text-xs font-semibold text-stone-900">prépositions</p>
            <ul className="mt-1 space-y-0.5 text-sm">
              {prepositions.map(({ pattern, meaning }) => (
                <li key={pattern}>
                  <span lang="fr" className="text-stone-800">{pattern}</span>
                  <span className="text-stone-400"> — </span>
                  <span lang="pt" className="font-medium text-blue-800">{meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
