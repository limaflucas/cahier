import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import DeleteConfirm from '../components/lists/DeleteConfirm.jsx';
import ListForm from '../components/lists/ListForm.jsx';
import RenameButton from '../components/lists/RenameButton.jsx';

/**
 * One list's page: its emoji and name, inline rename and delete, and its words.
 */
export default function WordList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading' });
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    api.list(id, controller.signal).then(
      (list) => setState({ status: 'done', list }),
      (error) => controller.signal.aborted || setState({ status: error.status === 404 ? 'missing' : 'error' }),
    );
    return () => controller.abort();
  }, [id]);

  if (state.status === 'loading') return <p className="text-stone-500">Chargement…</p>;
  if (state.status === 'missing') return <p className="text-stone-600">Ce sac n'existe pas.</p>;
  if (state.status === 'error') return <p className="text-stone-600">Impossible de charger ce sac.</p>;

  const { list } = state;

  async function rename(values) {
    setState({ status: 'done', list: await api.updateList(list.id, values) });
    setEditing(false);
  }

  async function remove() {
    await api.deleteList(list.id);
    navigate('/sac-de-mots');
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {editing
          ? <ListForm initial={list} submitLabel="Enregistrer" onSubmit={rename} onCancel={() => setEditing(false)} />
          : (
            <>
              <h1 className="min-w-0 font-serif text-3xl break-words text-stone-900">
                {list.emoji && <span className="mr-2">{list.emoji}</span>}
                {list.name}
              </h1>
              <RenameButton name={list.name} onClick={() => setEditing(true)} />
              <div className="ml-auto">
                {confirming
                  ? <DeleteConfirm name={list.name} onConfirm={remove} onCancel={() => setConfirming(false)} />
                  : (
                    <button type="button" onClick={() => setConfirming(true)} className="rounded-full px-3 py-1 text-sm font-medium text-stone-500 hover:bg-red-50 hover:text-red-700">
                      Supprimer
                    </button>
                  )}
              </div>
            </>
          )}
      </div>
      {list.wordCount === 0 && (
        <p className="mt-4 text-stone-500">Ce sac est vide. Tapez un mot dans la recherche en haut pour l'ajouter.</p>
      )}
    </>
  );
}
