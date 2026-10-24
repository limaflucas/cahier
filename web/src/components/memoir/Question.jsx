import { useEffect, useRef, useState } from 'react';
import Phrase from './Phrase.jsx';
import Reveal from './Reveal.jsx';

const DIRECTION_LABELS = { 'fr-pt': 'FR → PT', 'pt-fr': 'PT → FR' };
const CLUE_LANGUAGE = { 'fr-pt': 'fr', 'pt-fr': 'pt' };
const OPTION_LANGUAGE = { 'fr-pt': 'pt', 'pt-fr': 'fr' };
const PROMPTS = {
  'fr-pt': { phrase: 'Traduisez le mot surligné', definition: 'Quel mot portugais correspond à cette définition ?' },
  'pt-fr': { phrase: 'Quel mot français complète la phrase ?', translation: 'Quel mot français se traduit ainsi ?' },
};

function optionStyle(index, choice, answer) {
  if (choice === null) return 'border-stone-300 bg-white text-stone-900 hover:border-blue-600 hover:bg-blue-50';
  if (index === answer) return 'border-emerald-600 bg-emerald-50 text-emerald-900';
  if (index === choice) return 'border-rose-600 bg-rose-50 text-rose-900';
  return 'border-stone-200 bg-white text-stone-400';
}

export default function Question({ question, review, onAnswer, onNext }) {
  const { direction, clue, options, answer } = question;
  const [choice, setChoice] = useState(null);
  const nextButton = useRef(null);
  const answered = choice !== null;

  function choose(index) {
    setChoice(index);
    onAnswer(index === answer);
  }

  useEffect(() => {
    if (answered) {
      nextButton.current.focus();
      return;
    }
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.target.closest('input, textarea')) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < options.length) choose(index);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [answered]);

  return (
    <section className="mt-6">
      <div className="flex gap-2 text-xs font-semibold">
        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-800">{DIRECTION_LABELS[direction]}</span>
        {review && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">Révision</span>}
      </div>
      <p className="mt-4 text-sm text-stone-500">{PROMPTS[direction][clue.kind]}</p>
      <p lang={CLUE_LANGUAGE[direction]} className="mt-2 font-serif text-2xl leading-snug text-stone-900">
        {clue.kind === 'phrase' ? <Phrase text={clue.text} blank={direction === 'pt-fr' && !answered} /> : `« ${clue.text} »`}
      </p>

      <ol className="mt-6 grid gap-2 sm:grid-cols-2">
        {options.map((option, i) => (
          <li key={option}>
            <button
              type="button"
              onClick={() => choose(i)}
              disabled={answered}
              lang={OPTION_LANGUAGE[direction]}
              className={`flex w-full items-baseline gap-3 rounded-lg border px-3 py-2.5 text-left ${optionStyle(i, choice, answer)}`}
            >
              <span className="text-xs font-semibold tabular-nums text-stone-400">{i + 1}</span>
              {option}
            </button>
          </li>
        ))}
      </ol>

      {answered && (
        <>
          <Reveal word={question.word} reveal={question.reveal} correct={choice === answer} />
          <button
            ref={nextButton}
            type="button"
            onClick={onNext}
            className="mt-6 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
          >
            Suivant
          </button>
        </>
      )}
    </section>
  );
}
