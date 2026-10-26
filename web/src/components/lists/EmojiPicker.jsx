import { useId, useState } from 'react';
import { EMOJI_SUGGESTIONS } from '../../lists/emojis.js';

/**
 * A button showing the chosen emoji that opens a grid of suggestions and a field for any other emoji.
 * @param {{ value: string, onChange(emoji: string): void }} props
 */
export default function EmojiPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  function choose(emoji) {
    onChange(emoji);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Choisir un emoji"
        aria-expanded={open}
        aria-controls={panelId}
        className="grid size-10 place-items-center rounded-lg border border-stone-300 bg-stone-50 text-xl hover:bg-white focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        {value || <span className="text-base text-stone-400" aria-hidden="true">☺</span>}
      </button>
      {open && (
        <div id={panelId} className="absolute top-full left-0 z-20 mt-1 w-72 rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
          <div className="grid grid-cols-6 gap-1">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => choose(emoji)}
                aria-pressed={emoji === value}
                className={`grid size-10 place-items-center rounded-md text-xl hover:bg-blue-50 ${emoji === value ? 'bg-blue-100' : ''}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 border-t border-stone-100 pt-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.trim())}
              aria-label="Autre emoji"
              placeholder="Autre emoji"
              className="w-0 flex-1 rounded-md border border-stone-300 px-2 py-1.5 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            <button type="button" onClick={() => choose('')} className="rounded-md px-2 py-1.5 text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-900">
              Sans emoji
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
