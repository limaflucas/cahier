import { useState } from 'react';

/**
 * The inline « Supprimer « … » ? » question that replaces a Supprimer button.
 * @param {{ name: string, onConfirm(): Promise<void>, onCancel(): void }} props
 */
export default function DeleteConfirm({ name, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function confirm() {
    setBusy(true);
    setFailed(false);
    try {
      await onConfirm();
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 text-sm">
      <span className="min-w-0 text-stone-700">Supprimer « {name} » ?</span>
      <span className="flex gap-1">
        <button type="button" onClick={confirm} disabled={busy} className="rounded-full bg-red-700 px-3 py-1 font-medium text-white hover:bg-red-800 disabled:opacity-60">
          Oui
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className="rounded-full px-3 py-1 font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900">
          Non
        </button>
      </span>
      {failed && <span role="alert" className="w-full text-right text-red-700">La suppression a échoué. Réessayez.</span>}
    </div>
  );
}
