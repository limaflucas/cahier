import { Fragment } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { matchesSearch } from '../wordSearch.js';
import Classification from '../components/Classification.jsx';
import KeyMeanings from '../components/KeyMeanings.jsx';

const formatDate = (sqlDate) =>
  new Date(`${sqlDate.replace(' ', 'T')}Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

function Classifications({ classifications }) {
  return (
    <span className="text-sm">
      {classifications.map(({ pos, gender }, i) => (
        <Fragment key={`${pos}:${gender}`}>
          {i > 0 && <span className="text-stone-400">, </span>}
          <Classification pos={pos} gender={gender} />
        </Fragment>
      ))}
    </span>
  );
}

function SavedWord({ word, addedAt, summary }) {
  return (
    <li className="px-4 py-4">
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
}

export default function MyWords() {
  const state = useApi((signal) => api.myWords(signal), []);
  const { search } = useOutletContext();

  if (state.status === 'loading') return <p className="text-stone-500">Chargement…</p>;
  if (state.status === 'error') return <p className="text-stone-600">Impossible de charger vos mots.</p>;

  const words = state.data;
  const matching = words.filter(({ word }) => matchesSearch(word, search));
  const count = matching.length === words.length ? words.length : `${matching.length} sur ${words.length}`;

  return (
    <>
      <h1 className="font-serif text-3xl text-stone-900">
        Mes mots <span className="text-xl text-stone-400">({count})</span>
      </h1>
      {words.length === 0 && <p className="mt-4 text-stone-500">Aucun mot pour l'instant. Cherchez un mot et ajoutez-le.</p>}
      {words.length > 0 && matching.length === 0 && (
        <p className="mt-4 text-stone-500">
          Aucun de vos mots ne correspond à « {search.trim()} ». Appuyez sur Entrée pour le chercher dans le dictionnaire.
        </p>
      )}
      {matching.length > 0 && (
        <ul className="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {matching.map((saved) => <SavedWord key={saved.word} {...saved} />)}
        </ul>
      )}
    </>
  );
}
