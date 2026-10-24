import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { isReview, newSession, nextRequest, recordAnswer } from '../memoir/session.js';
import Question from '../components/memoir/Question.jsx';

function Failure({ error, onRetry }) {
  if (error.status === 404) {
    return (
      <p className="mt-8 text-stone-600">
        Memoir a besoin d'au moins 5 mots enregistrés.{' '}
        <Link to="/mes-mots" className="font-medium text-blue-700 hover:underline">Voir mes mots</Link>
      </p>
    );
  }
  return (
    <div className="mt-8">
      <p className="text-stone-600">Impossible de charger la question.</p>
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

export default function Memoir() {
  const [session, setSession] = useState(newSession);
  const [request, setRequest] = useState(() => nextRequest(newSession()));
  const state = useApi((signal) => api.memoirQuestion(request, signal), [request]);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl text-stone-900">Memoir</h1>
        <p className="text-sm text-stone-500">
          Score : <span className="font-semibold tabular-nums text-stone-900">{session.correct} / {session.asked}</span>
        </p>
      </header>
      {state.status === 'loading' && <p className="mt-8 text-stone-500">Chargement…</p>}
      {state.status === 'error' && <Failure error={state.error} onRetry={() => setRequest({ ...request })} />}
      {state.status === 'done' && (
        <Question
          question={state.data}
          review={isReview(request)}
          onAnswer={(correct) => setSession((s) => recordAnswer(s, { request, question: state.data, correct }))}
          onNext={() => setRequest(nextRequest(session))}
        />
      )}
    </div>
  );
}
