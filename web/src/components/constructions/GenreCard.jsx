import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GapSentence from '../games/GapSentence.jsx';

const GENDER_NAMES = { m: 'masculins', f: 'féminins' };

/**
 * What the noun's ending says about its gender, and whether this noun goes against it.
 * @param {{ rule: { ending: string, usualGender: 'm' | 'f', exception: boolean } | null }} props
 */
function EndingRule({ rule }) {
  if (!rule) return null;
  const usually = `noms en -${rule.ending} sont en général ${GENDER_NAMES[rule.usualGender]}.`;
  return (
    <p className={`mt-2 text-sm ${rule.exception ? 'font-medium text-amber-800' : 'text-stone-600'}`}>
      {rule.exception ? `Exception : les ${usually}` : `Les ${usually}`}
    </p>
  );
}

/**
 * The verdict, then the rule the noun's ending gives.
 * @param {{ card: object, right: boolean }} props
 */
function Feedback({ card, right }) {
  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
      <p role="status" className={`text-sm font-semibold ${right ? 'text-emerald-700' : 'text-rose-700'}`}>
        {right ? 'Bonne réponse !' : `Pas cette fois. Réponse : « ${card.answer} ${card.word} ».`}
      </p>
      <EndingRule rule={card.rule} />
      <Link to={`/mot/${encodeURIComponent(card.word)}`} lang="fr" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline">
        {card.word}
      </Link>
    </div>
  );
}

/**
 * One Genre card: pick the article that goes with the noun, with a click or its number key.
 * @param {{ card: object, onFinish: (outcome: 'right' | 'wrong') => void }} props
 */
export default function GenreCard({ card, onFinish }) {
  const [choice, setChoice] = useState(null);
  const nextButton = useRef(null);
  const answered = choice !== null;
  const right = choice === card.answer;

  useEffect(() => {
    if (answered) {
      nextButton.current.focus();
      return;
    }
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.target.closest('input, textarea')) return;
      const article = card.articles[Number(event.key) - 1];
      if (article) setChoice(article);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answered]);

  return (
    <section className="mt-6">
      <p className="text-sm text-stone-500">Quel article va avec ce nom ?</p>
      <p lang="fr" className="mt-2 font-serif text-2xl leading-snug text-stone-900">
        <GapSentence text={`___ ${card.word}`} filler={answered ? card.answer : null} missing="article manquant" />
      </p>
      <p lang="pt" className="mt-2 font-medium text-blue-800">{card.translations.join(', ')}</p>

      {!answered && (
        <div role="group" aria-label="Articles" className="mt-6 flex gap-2">
          {card.articles.map((article, i) => (
            <button
              key={article}
              type="button"
              lang="fr"
              onClick={() => setChoice(article)}
              className="flex items-baseline gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 font-serif text-lg text-stone-900 hover:border-blue-600 hover:bg-blue-50"
            >
              <span className="font-sans text-xs font-semibold tabular-nums text-stone-400">{i + 1}</span>{' '}{article}
            </button>
          ))}
        </div>
      )}

      {answered && (
        <>
          <Feedback card={card} right={right} />
          <button
            ref={nextButton}
            type="button"
            onClick={() => onFinish(right ? 'right' : 'wrong')}
            className="mt-6 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
          >
            Suivant
          </button>
        </>
      )}
    </section>
  );
}
