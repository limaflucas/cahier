import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gradeRecall } from '../../games/grade.js';
import Classification from '../Classification.jsx';
import LevelBadge from '../LevelBadge.jsx';
import ListenButton from '../ListenButton.jsx';
import Marked from '../Marked.jsx';
import Phrase from '../memoir/Phrase.jsx';

const RIGHT_VERDICTS = new Set(['correct', 'lemma', 'accent', 'overruled']);

const VERDICT_TEXTS = {
  correct: () => 'Bonne réponse !',
  lemma: (answer) => `Bonne réponse ! Dans cette phrase : « ${answer} ».`,
  accent: (answer) => `Bonne réponse, mais attention aux accents : « ${answer} ».`,
  wrong: (answer) => `Pas cette fois. Réponse : « ${answer} ».`,
  unknown: (answer) => `Réponse : « ${answer} ».`,
  overruled: () => 'Compté comme juste.',
};

const VERDICT_STYLES = {
  correct: 'text-emerald-700',
  lemma: 'text-emerald-700',
  accent: 'text-amber-700',
  wrong: 'text-rose-700',
  unknown: 'text-rose-700',
  overruled: 'text-emerald-700',
};

/**
 * What the schedule records for a verdict.
 * @param {string} verdict a gradeRecall verdict, 'unknown' for "Je ne sais pas" or 'overruled' for "J'avais raison"
 * @param {boolean} hinted
 * @returns {'right' | 'hinted' | 'wrong'}
 */
function outcomeOf(verdict, hinted) {
  if (!RIGHT_VERDICTS.has(verdict)) return 'wrong';
  return hinted ? 'hinted' : 'right';
}

/**
 * The verdict and the word it was about, with "J'avais raison" after a typed miss.
 * @param {{ card: object, verdict: string, onOverrule: () => void }} props
 */
function Feedback({ card, verdict, onOverrule }) {
  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
      <p role="status" className={`text-sm font-semibold ${VERDICT_STYLES[verdict]}`}>{VERDICT_TEXTS[verdict](card.answer)}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3">
        <Link to={`/mot/${encodeURIComponent(card.word)}`} lang="fr" className="font-serif text-2xl text-stone-900 hover:text-blue-700">
          {card.word}
        </Link>
        <ListenButton text={card.answer} />
        <span className="text-sm">
          <Classification pos={card.pos} gender={card.gender} />
        </span>
        {card.level && <LevelBadge level={card.level} />}
      </div>
      {card.sentence && <p lang="fr" className="mt-2 text-stone-900">{card.definition}</p>}
      {verdict === 'wrong' && (
        <button type="button" onClick={onOverrule} className="mt-3 text-sm font-medium text-blue-700 hover:underline">
          J'avais raison
        </button>
      )}
    </div>
  );
}

/**
 * One Rappel card: the word to type from memory into its sentence, or from its meaning.
 * @param {{ card: object, onFinish: (outcome: 'right' | 'hinted' | 'wrong') => void }} props
 */
export default function RappelCard({ card, onFinish }) {
  const [typed, setTyped] = useState('');
  const [hinted, setHinted] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const answerBox = useRef(null);
  const nextButton = useRef(null);
  const answered = verdict !== null;

  useEffect(() => {
    (answered ? nextButton : answerBox).current.focus();
  }, [answered]);

  /** @param {import('react').FormEvent} event */
  function check(event) {
    event.preventDefault();
    const graded = gradeRecall(typed, card);
    if (graded !== 'empty') setVerdict(graded);
  }

  return (
    <section className="mt-6">
      <p className="text-sm text-stone-500">{card.sentence ? 'Quel mot complète la phrase ?' : 'Quel mot correspond à ce sens ?'}</p>
      <p lang="fr" className="mt-2 font-serif text-2xl leading-snug text-stone-900">
        {card.sentence ? <Phrase text={card.sentence} blank={!answered} /> : `« ${card.definition} »`}
      </p>
      {card.portuguese && (
        <p lang="pt" className="mt-2 font-serif italic text-stone-600">
          <Marked text={card.portuguese} strongClassName="font-semibold text-stone-800" />
        </p>
      )}
      {card.translations.length > 0 && <p lang="pt" className="mt-2 font-medium text-blue-800">{card.translations.join(', ')}</p>}

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
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {hinted ? (
            <p className="text-amber-800">Commence par « {card.answer[0].toLowerCase()} »</p>
          ) : (
            <button type="button" onClick={() => setHinted(true)} className="font-medium text-blue-700 hover:underline">
              Indice
            </button>
          )}
          <button type="button" onClick={() => setVerdict('unknown')} className="font-medium text-stone-500 hover:text-stone-900 hover:underline">
            Je ne sais pas
          </button>
        </div>
      )}

      {answered && (
        <>
          <Feedback card={card} verdict={verdict} onOverrule={() => setVerdict('overruled')} />
          <button
            ref={nextButton}
            type="button"
            onClick={() => onFinish(outcomeOf(verdict, hinted))}
            className="mt-6 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
          >
            Suivant
          </button>
        </>
      )}
    </section>
  );
}
