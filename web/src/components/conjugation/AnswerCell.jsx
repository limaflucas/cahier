import { isLocked } from '../../conjugation/game.js';

const STATUS_STYLES = {
  given: 'border-transparent bg-stone-100 text-stone-500',
  empty: 'border-stone-300 bg-white text-stone-900',
  correct: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  accent: 'border-amber-400 bg-amber-50 text-amber-900',
  wrong: 'border-rose-300 bg-rose-50 text-rose-900',
  revealed: 'border-dashed border-stone-300 bg-white italic text-stone-500',
};

const STATUS_DESCRIPTIONS = {
  correct: 'correct',
  accent: 'vérifiez les accents',
  wrong: 'à corriger',
  revealed: 'réponse révélée',
};

export default function AnswerCell({ id, label, accessibleName, cell, isSource, onType, onCheck, onFocus, onEnter }) {
  const description = STATUS_DESCRIPTIONS[cell.status];
  return (
    <div className="flex items-start gap-2">
      {label !== null && (
        <label
          htmlFor={id}
          lang="fr"
          className={`mt-1.5 w-[5.75rem] shrink-0 text-right text-sm whitespace-nowrap ${
            isSource ? 'rounded-sm bg-amber-200 px-1 text-stone-900' : 'text-stone-500'
          }`}
        >
          {label}
        </label>
      )}
      <div className="min-w-0 flex-1">
        <input
          id={id}
          type="text"
          lang="fr"
          value={cell.value}
          readOnly={isLocked(cell)}
          aria-label={label === null ? accessibleName : undefined}
          aria-invalid={cell.status === 'wrong'}
          aria-description={description}
          title={cell.status === 'revealed' && cell.lastAttempt ? `Votre réponse : ${cell.lastAttempt}` : undefined}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => onType(event.target.value)}
          onBlur={onCheck}
          onFocus={onFocus}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            onEnter(event.currentTarget);
          }}
          className={`w-full rounded-md border px-2 py-1 font-serif text-base outline-none read-only:cursor-default focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 ${
            STATUS_STYLES[cell.status]
          } ${isSource ? 'ring-2 ring-amber-400' : ''}`}
        />
        {cell.status === 'accent' && <p className="mt-0.5 text-xs text-amber-700">Vérifiez les accents.</p>}
      </div>
    </div>
  );
}
