import { useState } from 'react';
import { api } from '../api.js';

export default function SaveButton({ word, initiallySaved }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      await (saved ? api.unsave(word) : api.save(word));
      setSaved(!saved);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition disabled:opacity-60 ${
        saved
          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
          : 'bg-blue-700 text-white hover:bg-blue-800'
      }`}
    >
      {saved ? '✓ Dans mes mots' : '+ Ajouter à mes mots'}
    </button>
  );
}
