import { useState } from 'react';
import { ApiError } from '../../api.js';
import EmojiPicker from './EmojiPicker.jsx';

const ERRORS = {
  invalid_name: 'Donnez un nom de 1 à 60 caractères.',
  name_taken: 'Un sac porte déjà ce nom.',
  invalid_emoji: 'Choisissez un seul emoji.',
};

/**
 * The inline form that names a list and gives it an emoji, showing why the server refused it.
 * @param {{
 *   initial?: { name: string, emoji: string | null },
 *   submitLabel: string,
 *   onSubmit(values: { name: string, emoji: string }): Promise<void>,
 *   onCancel(): void,
 * }} props
 */
export default function ListForm({ initial = { name: '', emoji: null }, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name);
  const [emoji, setEmoji] = useState(initial.emoji ?? '');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onSubmit({ name, emoji });
    } catch (err) {
      setError((err instanceof ApiError && ERRORS[err.message]) || "Impossible d'enregistrer le sac.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        <EmojiPicker value={emoji} onChange={setEmoji} />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Nom du sac"
          placeholder="Nom du sac"
          autoFocus
          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-base outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
        />
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="rounded-full bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60">
            {submitLabel}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900">
            Annuler
          </button>
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </form>
  );
}
