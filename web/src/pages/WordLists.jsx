import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api } from '../api.js';
import { matchesSearch } from '../wordSearch.js';
import { readListsOrder, saveListsOrder, sortLists, wordCountLabel } from '../lists/order.js';
import DeleteConfirm from '../components/lists/DeleteConfirm.jsx';
import ListForm from '../components/lists/ListForm.jsx';
import RenameButton from '../components/lists/RenameButton.jsx';
import SortSwitch from '../components/lists/SortSwitch.jsx';

const ORDER_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'alpha', label: 'A→Z' },
];

/**
 * One list: emoji, name, word count, rename pencil and, last on the right, Supprimer.
 * @param {{ list: import('../lists/order.js').List, onRename(values: object): Promise<void>, onDelete(): Promise<void> }} props
 */
function ListRow({ list, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (editing) {
    return (
      <li className="px-4 py-3">
        <ListForm
          initial={list}
          submitLabel="Enregistrer"
          onSubmit={async (values) => {
            await onRename(values);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`flex items-center gap-x-3 gap-y-2 px-4 py-3 ${confirming ? 'flex-wrap' : ''}`}>
      {list.emoji && <span className="shrink-0 text-xl">{list.emoji}</span>}
      <Link to={`/sac-de-mots/${list.id}`} className="min-w-0 truncate font-serif text-xl text-stone-900 hover:text-blue-700">
        {list.name}
      </Link>
      <span className="shrink-0 text-sm text-stone-500">{wordCountLabel(list.wordCount)}</span>
      <RenameButton name={list.name} onClick={() => setEditing(true)} />
      <div className={confirming ? 'w-full sm:ml-auto sm:w-auto' : 'ml-auto shrink-0'}>
        {confirming
          ? <DeleteConfirm name={list.name} onConfirm={onDelete} onCancel={() => setConfirming(false)} />
          : (
            <button type="button" onClick={() => setConfirming(true)} className="rounded-full px-3 py-1 text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-700">
              Supprimer
            </button>
          )}
      </div>
    </li>
  );
}

/**
 * The Sac de mots page: every list, filtered by the header search, sorted by date or name.
 */
export default function WordLists() {
  const { search } = useOutletContext();
  const [lists, setLists] = useState(null);
  const [failed, setFailed] = useState(false);
  const [creating, setCreating] = useState(false);
  const [order, setOrder] = useState(readListsOrder);

  useEffect(() => {
    const controller = new AbortController();
    api.lists(controller.signal).then(setLists, () => controller.signal.aborted || setFailed(true));
    return () => controller.abort();
  }, []);

  if (failed) return <p className="text-stone-600">Impossible de charger vos sacs.</p>;
  if (!lists) return <p className="text-stone-500">Chargement…</p>;

  const matching = sortLists(lists.filter(({ name }) => matchesSearch(name, search)), order);
  const count = matching.length === lists.length ? lists.length : `${matching.length} sur ${lists.length}`;
  const replace = (updated) => setLists((all) => all.map((list) => (list.id === updated.id ? updated : list)));

  function changeOrder(next) {
    setOrder(next);
    saveListsOrder(next);
  }

  async function create(values) {
    const list = await api.createList(values);
    setLists((all) => [list, ...all]);
    setCreating(false);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl text-stone-900">
          Sac de mots <span className="text-xl text-stone-400">({count})</span>
        </h1>
        <div className="ml-auto flex items-center gap-3">
          {lists.length > 0 && <SortSwitch value={order} onChange={changeOrder} options={ORDER_OPTIONS} />}
          {!creating && (
            <button type="button" onClick={() => setCreating(true)} className="rounded-full bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800">
              Nouveau sac
            </button>
          )}
        </div>
      </div>
      {creating && (
        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
          <ListForm submitLabel="Créer" onSubmit={create} onCancel={() => setCreating(false)} />
        </div>
      )}
      {lists.length === 0 && !creating && <p className="mt-4 text-stone-500">Aucun sac pour l'instant. Créez-en un avec « Nouveau sac ».</p>}
      {lists.length > 0 && matching.length === 0 && (
        <p className="mt-4 text-stone-500">
          Aucun de vos sacs ne correspond à « {search.trim()} ». Appuyez sur Entrée pour chercher ce mot dans le dictionnaire.
        </p>
      )}
      {matching.length > 0 && (
        <ul aria-label="Mes sacs" className="mt-6 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {matching.map((list) => (
            <ListRow
              key={list.id}
              list={list}
              onRename={async (values) => replace(await api.updateList(list.id, values))}
              onDelete={async () => {
                await api.deleteList(list.id);
                setLists((all) => all.filter(({ id }) => id !== list.id));
              }}
            />
          ))}
        </ul>
      )}
    </>
  );
}
