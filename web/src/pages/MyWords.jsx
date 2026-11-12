import { memo, useDeferredValue } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { matchesSearch } from '../wordSearch.js';
import Classifications from '../components/Classifications.jsx';
import KeyMeanings from '../components/KeyMeanings.jsx';

const formatDate = (sqlDate) =>
  new Date(`${sqlDate.replace(' ', 'T')}Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

/**
 * One saved word with its classifications and key meanings. Filtering hides rows rather than unmounting them,
 * and memo keeps the rows whose visibility did not change from rendering again.
 */
const SavedWord = memo(function SavedWord({ word, addedAt, summary, hidden }) {
  return (
    <li hidden={hidden} className="border-stone-200 px-4 py-4 [contain-intrinsic-size:auto_8rem] [content-visibility:auto]">
      <div className="flex items-baseline justify-between gap-4">
        <p className="flex flex-wrap items-baseline gap-x-3">
          <Link to={`/mot/${encodeURIComponent(word)}`} lang="fr" className="font-serif text-xl text-stone-900 hover:text-blue-700">
            {word}
          </Link>
          {summary && <Classifications classifications={summary.classifications} />}
        </p>
        <span className="text-xs text-stone-400">{formatDate(addedAt)}</span>
      </div>
      <KeyMeanings meanings={summary?.meanings ?? null} showPos={summary?.classifications.length > 1} />
    </li>
  );
});

/** The saved words, newest first, filtered by the header search. */
export default function MyWords() {
  const state = useApi((signal) => api.myWords(signal), []);
  const { search } = useOutletContext();
  const query = useDeferredValue(search);

  if (state.status === 'loading') return <p className="text-stone-500">Chargement…</p>;
  if (state.status === 'error') return <p className="text-stone-600">Impossible de charger vos mots.</p>;

  const words = state.data;
  const matches = words.map(({ word }) => matchesSearch(word, query));
  const matching = matches.filter(Boolean).length;
  const count = matching === words.length ? words.length : `${matching} sur ${words.length}`;

  return (
    <>
      <h1 className="font-serif text-3xl text-stone-900">
        Mes mots <span className="text-xl text-stone-400">({count})</span>
      </h1>
      {words.length === 0 && <p className="mt-4 text-stone-500">Aucun mot pour l'instant. Cherchez un mot et ajoutez-le.</p>}
      {words.length > 0 && matching === 0 && (
        <p className="mt-4 text-stone-500">
          Aucun de vos mots ne correspond à « {query.trim()} ». Appuyez sur Entrée pour le chercher dans le dictionnaire.
        </p>
      )}
      {words.length > 0 && (
        <ul
          hidden={matching === 0}
          className="mt-6 rounded-xl border border-stone-200 bg-white [&>li:not([hidden])~li:not([hidden])]:border-t"
        >
          {words.map((saved, i) => <SavedWord key={saved.word} {...saved} hidden={!matches[i]} />)}
        </ul>
      )}
    </>
  );
}
