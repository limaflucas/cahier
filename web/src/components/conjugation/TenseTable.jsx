import { useState } from 'react';
import { cellKey } from '../../conjugation/game.js';
import AnswerCell from './AnswerCell.jsx';
import TipPanel from './TipPanel.jsx';

function TipButton({ expanded, controls, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controls}
      className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        expanded ? 'bg-amber-200 text-stone-900' : 'text-amber-800 hover:bg-amber-100'
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
      </svg>
      Astuce
    </button>
  );
}

export default function TenseTable({ tense, tenseBoard, game, sources, handlers }) {
  const [tipOpen, setTipOpen] = useState(false);
  const titleId = `${tense.id}-title`;
  const tipId = `${tense.id}-tip`;
  const hasCells = tenseBoard.cells.some(Boolean);

  return (
    <section aria-labelledby={titleId} className="rounded-xl border border-stone-200 bg-white p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 id={titleId} className="font-serif text-lg font-semibold text-stone-900">{tense.name}</h3>
          {tense.derivedFrom && <p className="text-xs text-stone-500">← {tense.derivedFrom.label}</p>}
        </div>
        {hasCells && <TipButton expanded={tipOpen} controls={tipId} onClick={() => setTipOpen(!tipOpen)} />}
      </header>
      {tipOpen && <TipPanel id={tipId} tense={tense} hints={tenseBoard.hints} />}
      <div className="mt-3 space-y-2">
        {hasCells ? (
          tenseBoard.cells.map((boardCell, index) => {
            if (!boardCell) return null;
            const key = cellKey(tense.id, index);
            return (
              <AnswerCell
                key={key}
                id={`cell-${tense.id}-${index}`}
                label={boardCell.label}
                accessibleName={tense.name}
                cell={game.cells[key]}
                isSource={sources.has(key)}
                onType={(value) => handlers.type(key, value)}
                onCheck={() => handlers.check(key)}
                onFocus={() => handlers.focus(key)}
                onEnter={handlers.next}
              />
            );
          })
        ) : (
          <p className="text-sm text-stone-500">Ce verbe n'a pas cette forme.</p>
        )}
      </div>
    </section>
  );
}
