import { Fragment, useMemo, useReducer, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { gameReducer, levelById, newGame, scoreOf } from '../conjugation/game.js';
import { savePreferredLevel } from '../conjugation/preferredLevel.js';
import { gamePath, pickSavedVerb } from '../conjugation/randomVerb.js';
import { sourceKeys } from '../conjugation/sources.js';
import { NON_FINITE_TENSES, TENSES_BY_ID, TWIN_TENSES, groupByMood } from '../tenses/index.js';
import HeadwordMark from '../components/HeadwordMark.jsx';
import ListenButton from '../components/ListenButton.jsx';
import GameSummary from '../components/conjugation/GameSummary.jsx';
import LevelPicker from '../components/conjugation/LevelPicker.jsx';
import TenseTable from '../components/conjugation/TenseTable.jsx';

const MOODS = groupByMood(TWIN_TENSES, ([simple]) => TENSES_BY_ID[simple].mood);

const secondaryButton =
  'rounded-full border border-stone-300 bg-white px-3.5 py-1.5 text-sm font-medium text-stone-800 hover:bg-stone-100';

function Progress({ score }) {
  const percent = score.playable > 0 ? (score.correct / score.playable) * 100 : 0;
  return (
    <div className="mt-3 w-64 max-w-full">
      <p className="text-sm text-stone-600">{score.correct} sur {score.playable} trouvées</p>
      <div
        role="progressbar"
        aria-label="Cases trouvées"
        aria-valuemin={0}
        aria-valuemax={score.playable}
        aria-valuenow={score.correct}
        className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-200"
      >
        <div className="h-full rounded-full bg-emerald-500 transition-[width] motion-reduce:transition-none" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ColumnHeadings() {
  return (
    <div aria-hidden="true" className="mt-1 hidden text-sm text-stone-500 lg:grid lg:grid-cols-[1fr_2.5rem_1fr]">
      <p>Temps simples</p>
      <span />
      <p>Temps composés : auxiliaire + participe passé</p>
    </div>
  );
}

function AuxiliaryArrow() {
  return (
    <div aria-hidden="true" className="hidden items-center justify-center text-stone-300 lg:flex">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </div>
  );
}

function Game({ board, level }) {
  const navigate = useNavigate();
  const [game, dispatch] = useReducer(gameReducer, undefined, () => newGame(board, level));
  const [focusedKey, setFocusedKey] = useState(null);
  const [pickError, setPickError] = useState(null);
  const boardRef = useRef(null);
  const score = scoreOf(game);
  const sources = useMemo(() => sourceKeys(focusedKey), [focusedKey]);

  const handlers = useMemo(
    () => ({
      type: (key, value) => dispatch({ type: 'type', key, value }),
      check: (key) => {
        dispatch({ type: 'check', key });
        setFocusedKey((current) => (current === key ? null : current));
      },
      focus: setFocusedKey,
      next: (input) => {
        const editable = [...boardRef.current.querySelectorAll('input:not([readonly])')];
        const following = editable[editable.indexOf(input) + 1];
        if (following) following.focus();
        else input.blur();
      },
    }),
    [],
  );

  function changeLevel(id) {
    savePreferredLevel(id);
    navigate(gamePath(board.verb, id), { replace: true });
  }

  async function playAnotherSavedVerb() {
    setPickError(null);
    const picked = await pickSavedVerb(board.verb);
    if (picked.verb) navigate(gamePath(picked.verb, level.id));
    else setPickError(picked.error);
  }

  const restart = () => dispatch({ type: 'restart', game: newGame(board, level) });

  const table = (id) => (
    <TenseTable key={id} tense={TENSES_BY_ID[id]} tenseBoard={board.tenses[id]} game={game} sources={sources} handlers={handlers} />
  );

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <div className="flex items-baseline gap-x-2">
            <h1 lang="fr" className="font-serif text-5xl font-semibold text-stone-900">
              <HeadwordMark>{board.verb}</HeadwordMark>
            </h1>
            <ListenButton text={board.verb} className="translate-y-1" />
          </div>
          <Progress score={score} />
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <LevelPicker value={level.id} onChange={changeLevel} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={restart} className={secondaryButton}>Recommencer</button>
            <button type="button" onClick={playAnotherSavedVerb} className={secondaryButton}>Autre verbe de mes mots</button>
            <Link to="/conjugaison" className={secondaryButton}>Changer de verbe</Link>
            {!game.finished && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'finish' })}
                className="rounded-full bg-stone-800 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-stone-900"
              >
                Terminer
              </button>
            )}
          </div>
          {pickError && <p role="alert" className="text-sm text-rose-700">{pickError}</p>}
        </div>
      </header>

      {(game.finished || score.complete) && (
        <div className="mt-8">
          <GameSummary score={score} onReplay={restart} onNextVerb={playAnotherSavedVerb} />
        </div>
      )}

      <div ref={boardRef} className="mt-10 space-y-10">
        <section aria-labelledby="participes-title">
          <h2 id="participes-title" className="font-serif text-2xl font-semibold text-stone-900">Participes et gérondif</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-3">{NON_FINITE_TENSES.map(table)}</div>
        </section>

        {MOODS.map(({ mood, items }, i) => (
          <section key={mood} aria-label={mood}>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">{mood}</h2>
            {i === 0 && <ColumnHeadings />}
            <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_2.5rem_1fr] lg:gap-x-0">
              {items.map(([simple, compound]) => (
                <Fragment key={simple}>
                  {table(simple)}
                  <AuxiliaryArrow />
                  {table(compound)}
                </Fragment>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

const loadErrorMessage = (error, verb) =>
  error.status === 404
    ? `« ${verb} » n'est pas un verbe connu. Tapez l'infinitif, par exemple « plier » ou « se souvenir ».`
    : 'Impossible de charger ce verbe pour le moment.';

export default function ConjugationGame() {
  const { verb } = useParams();
  const [searchParams] = useSearchParams();
  const level = levelById(searchParams.get('niveau'));
  const state = useApi((signal) => api.conjugation(verb, signal), [verb]);

  if (state.status === 'loading') return <p className="text-stone-500">Préparation de « {verb} »…</p>;
  if (state.status === 'error') {
    return (
      <div>
        <p className="text-stone-700">{loadErrorMessage(state.error, verb)}</p>
        <Link to="/conjugaison" className="mt-3 inline-block font-medium text-blue-700 hover:text-blue-900">
          Choisir un autre verbe
        </Link>
      </div>
    );
  }
  return <Game key={`${state.data.verb}:${level.id}`} board={state.data} level={level} />;
}
