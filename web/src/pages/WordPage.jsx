import { useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import HeadwordMark from '../components/HeadwordMark.jsx';
import ListenButton from '../components/ListenButton.jsx';
import SaveButton from '../components/SaveButton.jsx';
import YouglishLink from '../components/YouglishLink.jsx';
import Prepositions from '../components/Prepositions.jsx';
import PosSection from '../components/PosSection.jsx';

const ERRORS = {
  404: (word) => `Aucun résultat pour « ${word} ».`,
  502: () => 'Le dictionnaire est indisponible pour le moment. Réessayez plus tard.',
};

function Word({ entry }) {
  return (
    <article className="mb-14">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-baseline gap-x-3">
          <h1 lang="fr" className="font-serif text-5xl font-semibold text-stone-900">
            <HeadwordMark>{entry.word}</HeadwordMark>
          </h1>
          {entry.ipa && <span className="text-lg text-stone-500">/{entry.ipa}/</span>}
          <div className="flex translate-y-1 items-center">
            <ListenButton text={entry.word} />
            <YouglishLink word={entry.word} />
          </div>
        </div>
        <div className="w-full sm:ml-auto sm:w-auto">
          <SaveButton word={entry.word} initiallySaved={entry.saved} />
        </div>
      </header>
      {entry.prepositions !== undefined && <Prepositions constructions={entry.prepositions} />}
      {entry.sections.map((section, i) => <PosSection key={i} section={section} />)}
    </article>
  );
}

export default function WordPage() {
  const { word } = useParams();
  const state = useApi((signal) => api.lookup(word, signal), [word]);

  if (state.status === 'loading') return <p className="text-stone-500">Recherche de « {word} »…</p>;
  if (state.status === 'error') {
    const message = ERRORS[state.error.status]?.(word) ?? 'Une erreur est survenue.';
    return <p className="text-stone-600">{message}</p>;
  }

  const { query, words } = state.data;
  const headwords = words.map((w) => w.word);
  return (
    <>
      {!headwords.includes(query) && (
        <p className="mb-6 text-sm text-stone-500">
          « {query} » → {headwords.join(', ')}
        </p>
      )}
      {words.map((entry) => <Word key={entry.word} entry={entry} />)}
    </>
  );
}
