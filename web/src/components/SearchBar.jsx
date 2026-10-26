import { useId, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { useFlag } from '../flags.jsx';
import { readRecentSearches, rememberSearch } from '../searchHistory.js';

const PURPOSES = {
  myWords: { placeholder: 'Filtrer mes mots…', label: 'Filtrer mes mots ou chercher un mot' },
  lists: { placeholder: 'Filtrer mes sacs…', label: 'Filtrer mes sacs ou chercher un mot' },
  lookup: { placeholder: 'Chercher un mot…', label: 'Chercher un mot' },
};

export default function SearchBar({ query, onQueryChange }) {
  const navigate = useNavigate();
  const sacDeMots = useFlag('sac-de-mots');
  const filtersMyWords = useMatch('/mes-mots') !== null;
  const filtersLists = useMatch('/sac-de-mots') !== null && sacDeMots;
  const purpose = PURPOSES[filtersMyWords ? 'myWords' : filtersLists ? 'lists' : 'lookup'];
  const listId = useId();
  const [recentSearches, setRecentSearches] = useState(null);
  const [active, setActive] = useState(0);
  const isOpen = recentSearches !== null;

  const close = () => setRecentSearches(null);

  function search(word) {
    rememberSearch(word);
    close();
    navigate(`/mot/${encodeURIComponent(word)}`);
    onQueryChange('');
  }

  function submit(event) {
    event.preventDefault();
    const word = isOpen ? recentSearches[active] : query.trim();
    if (word) search(word);
  }

  function open() {
    const searches = readRecentSearches();
    if (searches.length === 0) return;
    setRecentSearches(searches);
    setActive(0);
  }

  function handleKeyDown(event) {
    const step = { ArrowUp: -1, ArrowDown: 1 }[event.key];
    if (step && isOpen) {
      setActive((i) => Math.min(Math.max(i + step, 0), recentSearches.length - 1));
    } else if (event.key === 'ArrowUp') {
      open();
    } else if (event.key === 'Escape' && isOpen) {
      close();
    } else {
      return;
    }
    event.preventDefault();
  }

  return (
    <form onSubmit={submit} role="search" className="relative order-last flex w-full sm:order-none sm:w-auto sm:flex-1">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          close();
          onQueryChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onBlur={close}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={isOpen ? `${listId}-${active}` : undefined}
        placeholder={purpose.placeholder}
        aria-label={purpose.label}
        lang="fr"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-base outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
      />
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Recherches récentes"
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-stone-200 bg-white py-1 shadow-lg"
        >
          {recentSearches.map((word, i) => (
            <li
              key={word}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              lang="fr"
              onMouseEnter={() => setActive(i)}
              onClick={() => search(word)}
              className={`cursor-pointer px-3 py-2 ${i === active ? 'bg-blue-50 text-blue-800' : 'text-stone-700'}`}
            >
              {word}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
