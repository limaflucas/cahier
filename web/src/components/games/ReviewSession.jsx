import { useState } from 'react';
import { api } from '../../api.js';
import { answerCard, currentCard, isFinished, newSession } from '../../games/session.js';
import { localDay } from '../../games/today.js';
import { useApi } from '../../useApi.js';

const LONG_DATE = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

/**
 * @param {string} day YYYY-MM-DD
 * @returns {string} the day spelled out, e.g. "vendredi 20 novembre"
 */
const longDate = (day) => LONG_DATE.format(new Date(`${day}T00:00`));

/**
 * @param {number} count answers the server did not take
 * @returns {string}
 */
const unsavedMessage = (count) =>
  count === 1 ? "Une réponse n'a pas pu être enregistrée." : `${count} réponses n'ont pas pu être enregistrées.`;

/**
 * Why the session could not be loaded, with a way to try again.
 * @param {{ onRetry: () => void }} props
 */
function Failure({ onRetry }) {
  return (
    <div className="mt-8">
      <p className="text-stone-600">Impossible de charger la séance.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium text-stone-800 hover:bg-stone-100"
      >
        Réessayer
      </button>
    </div>
  );
}

/**
 * Today's cards one at a time, each card's first answer sent to the schedule.
 * A failed save is reported but never stops the session.
 * @param {{ path: string, today: string, start: { cards: object[], nextDueOn: string | null }, Card: Function,
 *   empty: import('react').ReactNode, notes?: (start: object) => import('react').ReactNode }} props
 */
function Deck({ path, today, start, Card, empty, notes }) {
  const [session, setSession] = useState(() => newSession(start.cards));
  const [unsaved, setUnsaved] = useState(0);
  const card = currentCard(session);

  /** @param {'right' | 'hinted' | 'wrong'} outcome */
  function finish(outcome) {
    const { session: next, first } = answerCard(session, outcome);
    if (first) {
      api.gameAnswer(path, { word: card.word, item: card.item, outcome, today }).catch(() => setUnsaved((count) => count + 1));
    }
    setSession(next);
  }

  return (
    <>
      {notes?.(start)}
      {unsaved > 0 && <p role="alert" className="mt-4 text-sm text-rose-700">{unsavedMessage(unsaved)}</p>}
      <Progress start={start} session={session} empty={empty}>
        <Card key={session.turn} card={card} onFinish={finish} />
      </Progress>
    </>
  );
}

/**
 * Where the session stands: nothing to do today, finished, or the current card with how many remain.
 * @param {{ start: { cards: object[], nextDueOn: string | null }, session: object, empty: import('react').ReactNode,
 *   children: import('react').ReactNode }} props children: the current card
 */
function Progress({ start, session, empty, children }) {
  if (start.cards.length === 0) {
    if (!start.nextDueOn) return empty;
    return (
      <p className="mt-8 text-stone-600">
        Rien à réviser aujourd'hui. Prochaine révision : {longDate(start.nextDueOn)}.
      </p>
    );
  }
  if (isFinished(session)) {
    return (
      <div className="mt-8">
        <p className="font-serif text-2xl text-stone-900">Séance terminée !</p>
        <p className="mt-1 text-stone-600">{session.rightFirstTime} sur {session.total} du premier coup.</p>
      </div>
    );
  }
  return (
    <>
      <p className="mt-2 text-sm text-stone-500">
        Restantes : <span className="font-semibold tabular-nums text-stone-900">{session.queue.length}</span>
      </p>
      {children}
    </>
  );
}

/**
 * A review game's page: its title, then today's session from the game's API under `path`.
 * @param {{ title: string, path: string, Card: Function, empty: import('react').ReactNode,
 *   tabs?: import('react').ReactNode, notes?: (start: object) => import('react').ReactNode }} props
 *   Card renders one card and calls onFinish(outcome) once the learner moves on
 */
export default function ReviewSession({ title, path, Card, empty, tabs = null, notes }) {
  const [today] = useState(localDay);
  const [attempt, setAttempt] = useState(0);
  const state = useApi((signal) => api.gameSession(path, today, signal), [path, attempt]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl text-stone-900">{title}</h1>
      {tabs}
      {state.status === 'loading' && <p className="mt-8 text-stone-500">Chargement…</p>}
      {state.status === 'error' && <Failure onRetry={() => setAttempt((count) => count + 1)} />}
      {state.status === 'done' && (
        <Deck key={path} path={path} today={today} start={state.data} Card={Card} empty={empty} notes={notes} />
      )}
    </div>
  );
}
