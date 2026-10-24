import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gamePath, pickSavedVerb } from '../conjugation/randomVerb.js';
import { readPreferredLevel, savePreferredLevel } from '../conjugation/preferredLevel.js';
import LevelPicker from '../components/conjugation/LevelPicker.jsx';

export default function ConjugationSetup() {
  const navigate = useNavigate();
  const [verb, setVerb] = useState('');
  const [level, setLevel] = useState(readPreferredLevel);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState(null);

  function chooseLevel(id) {
    setLevel(id);
    savePreferredLevel(id);
  }

  function start(event) {
    event.preventDefault();
    const typed = verb.trim();
    if (typed) navigate(gamePath(typed, level));
  }

  async function startWithSavedVerb() {
    setPicking(true);
    setError(null);
    const picked = await pickSavedVerb();
    setPicking(false);
    if (picked.verb) navigate(gamePath(picked.verb, level));
    else setError(picked.error);
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="font-serif text-4xl font-semibold text-stone-900">Conjugaison</h1>
      <p className="mt-3 text-stone-700">
        Remplissez les treize formes d'un verbe. Chaque case est corrigée dès que vous la quittez, et les cases dont elle
        dérive s'allument pour vous guider.
      </p>

      <div className="mt-8 space-y-6">
        <LevelPicker value={level} onChange={chooseLevel} />

        <form onSubmit={start} className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="verb" className="sr-only">Verbe</label>
          <input
            id="verb"
            type="text"
            value={verb}
            onChange={(event) => setVerb(event.target.value)}
            placeholder="plier, se souvenir, s'asseoir…"
            lang="fr"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
          <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 font-medium whitespace-nowrap text-white hover:bg-blue-800">
            Conjuguer ce verbe
          </button>
          <button
            type="button"
            onClick={startWithSavedVerb}
            disabled={picking}
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium whitespace-nowrap text-stone-800 hover:bg-stone-100 disabled:opacity-60"
          >
            {picking ? 'Choix en cours…' : 'Piocher dans mes mots'}
          </button>
        </form>
      </div>

      <p className="mt-2 text-sm text-stone-500">« Piocher » choisit un verbe de vos mots ; ceux aux sens B2 et C1 sortent plus souvent.</p>
      {error && <p role="alert" className="mt-2 text-sm text-rose-700">{error}</p>}
    </div>
  );
}
