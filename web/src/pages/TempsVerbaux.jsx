import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { TENSES, groupByMood } from '../tenses/index.js';
import Overview from '../components/tenses/Overview.jsx';
import TenseSection from '../components/tenses/TenseSection.jsx';

const MODEL_VERBS = [...new Set(TENSES.flatMap((tense) => tense.models))];
const TABLE_OF_CONTENTS = groupByMood(TENSES, (tense) => tense.mood);

/**
 * Conjugation boards of every model verb on the page, by verb.
 * @param {AbortSignal} signal
 * @returns {Promise<Record<string, object>>}
 */
async function loadModels(signal) {
  const boards = await Promise.all(MODEL_VERBS.map((verb) => api.conjugation(verb, signal)));
  return Object.fromEntries(MODEL_VERBS.map((verb, i) => [verb, boards[i]]));
}

/**
 * Scrolls to the tense named in the URL hash, again once the models have loaded.
 * @param {string} ready the models' loading status
 */
function useScrollToHash(ready) {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash, ready]);
}

/** The page's table of contents, tenses grouped by mood. */
function TableOfContents() {
  return (
    <nav aria-label="Sommaire" className="text-sm lg:sticky lg:top-6">
      <a href="#vue-d-ensemble" className="font-medium text-stone-700 hover:text-blue-700">Vue d'ensemble</a>
      {TABLE_OF_CONTENTS.map(({ mood, items }) => (
        <div key={mood} className="mt-4">
          <p className="text-xs font-medium text-stone-500">{mood}</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 lg:block lg:space-y-1">
            {items.map((tense) => (
              <li key={tense.id}>
                <a href={`#${tense.id}`} className="text-stone-700 hover:text-blue-700">{tense.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** The verb tenses reference page. */
export default function TempsVerbaux() {
  const models = useApi(loadModels, []);
  useScrollToHash(models.status);

  return (
    <>
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-stone-900">Temps verbaux</h1>
        <p className="mt-3 text-lg text-stone-700">
          Les treize formes du jeu Conjugaison, plus le passé simple des livres : comment les former, quand les employer,
          et les nuances qui comptent aux niveaux B2 et C1.
        </p>
        <p lang="pt" className="mt-1 text-blue-800">
          As treze formas do jogo Conjugaison, mais o passé simple dos livros: como formá-las, quando usá-las e as nuances
          dos níveis B2 e C1.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <aside><TableOfContents /></aside>
        <div className="max-w-3xl space-y-14">
          <Overview />
          {TENSES.map((tense) => <TenseSection key={tense.id} tense={tense} models={models} />)}
        </div>
      </div>
    </>
  );
}
