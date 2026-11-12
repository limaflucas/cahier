import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { normalizeAnswer } from '../../answer.js';
import { contractionOf, gradePreposition } from '../../games/grade.js';
import GapSentence from '../games/GapSentence.jsx';

const PREPOSITIONS = ['à', 'de', 'en', 'dans', 'par', 'pour', 'sur', 'avec', 'contre', 'chez'];

const VERDICT_STYLES = { correct: 'text-emerald-700', contraction: 'text-emerald-700', accent: 'text-amber-700', wrong: 'text-rose-700' };

/**
 * @param {'correct' | 'contraction' | 'accent' | 'wrong'} verdict
 * @param {string} answer the preposition the sentence uses, '' for none
 * @returns {string}
 */
function verdictText(verdict, answer) {
  if (verdict === 'correct') return 'Bonne réponse !';
  if (verdict === 'contraction') return `Bonne réponse ! ${contractionOf(answer)}.`;
  if (verdict === 'accent') return `Bonne réponse, mais attention aux accents : « ${answer} ».`;
  return answer ? `Pas cette fois. Réponse : « ${answer} ».` : 'Pas cette fois : pas de préposition ici.';
}

/**
 * The verdict, then the construction next to its Portuguese equivalent, flagged when the two differ.
 * @param {{ card: object, verdict: string }} props
 */
function Feedback({ card, verdict }) {
  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
      <p role="status" className={`text-sm font-semibold ${VERDICT_STYLES[verdict]}`}>{verdictText(verdict, card.answer)}</p>
      <p lang="fr" className="mt-1 font-serif text-2xl text-stone-900">{card.pattern}</p>
      <p className="mt-1 flex flex-wrap items-center gap-2">
        <span lang="pt" className="font-medium text-blue-800">{card.portuguese}</span>
        {card.differsFromPortuguese && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">≠ português</span>
        )}
      </p>
      <Link to={`/mot/${encodeURIComponent(card.word)}`} lang="fr" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline">
        {card.word}
      </Link>
    </div>
  );
}

/**
 * One Prépositions card: type or tap the preposition that fills the gap.
 * @param {{ card: object, onFinish: (outcome: 'right' | 'wrong') => void }} props
 */
export default function PrepositionCard({ card, onFinish }) {
  const [typed, setTyped] = useState('');
  const [verdict, setVerdict] = useState(null);
  const answerBox = useRef(null);
  const nextButton = useRef(null);
  const answered = verdict !== null;

  useEffect(() => {
    (answered ? nextButton : answerBox).current.focus();
  }, [answered]);

  /** @param {string} preposition '' for none */
  function answerWith(preposition) {
    setTyped(preposition);
    setVerdict(gradePreposition(preposition, card.answer));
  }

  /** @param {import('react').FormEvent} event */
  function check(event) {
    event.preventDefault();
    if (normalizeAnswer(typed)) answerWith(typed);
  }

  return (
    <section className="mt-6">
      <p className="text-sm text-stone-500">Quelle préposition complète la phrase ?</p>
      <p lang="fr" className="mt-2 font-serif text-2xl leading-snug text-stone-900">
        <GapSentence text={card.sentence} filler={answered ? card.answer : null} missing="préposition manquante" />
      </p>
      <p lang="pt" className="mt-2 font-medium text-blue-800">{card.meaning}</p>

      <form onSubmit={check} className="mt-6 flex gap-2">
        <input
          ref={answerBox}
          type="text"
          lang="fr"
          aria-label="Votre réponse"
          value={typed}
          readOnly={answered}
          onChange={(event) => setTyped(event.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 font-serif text-lg outline-none read-only:bg-stone-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
        {!answered && (
          <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800">
            Vérifier
          </button>
        )}
      </form>

      {!answered && (
        <div role="group" aria-label="Prépositions" className="mt-3 flex flex-wrap gap-2">
          {PREPOSITIONS.map((preposition) => (
            <button
              key={preposition}
              type="button"
              lang="fr"
              onClick={() => answerWith(preposition)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-serif text-stone-900 hover:border-blue-600 hover:bg-blue-50"
            >
              {preposition}
            </button>
          ))}
          <button
            type="button"
            onClick={() => answerWith('')}
            className="rounded-lg border border-dashed border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-600 hover:border-blue-600 hover:bg-blue-50"
          >
            sans préposition
          </button>
        </div>
      )}

      {answered && (
        <>
          <Feedback card={card} verdict={verdict} />
          <button
            ref={nextButton}
            type="button"
            onClick={() => onFinish(verdict === 'wrong' ? 'wrong' : 'right')}
            className="mt-6 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
          >
            Suivant
          </button>
        </>
      )}
    </section>
  );
}
