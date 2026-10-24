import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import SearchBar from './components/SearchBar.jsx';

const MENU = [
  { to: '/mes-mots', label: 'Mes mots' },
  { to: '/temps-verbaux', label: 'Temps verbaux' },
  { to: '/conjugaison', label: 'Conjugaison' },
  { to: '/memoir', label: 'Memoir' },
];

const ACTIVE = 'border-blue-600 font-semibold text-blue-700';
const INACTIVE = 'border-transparent font-medium text-stone-500 hover:text-stone-900';

function NavMenu({ vertical = false }) {
  const shape = vertical ? 'border-l-4 px-4 py-2.5 text-lg' : 'border-b-2 px-1 py-2 text-sm sm:px-2';
  return (
    <ul className={vertical ? 'space-y-1' : 'flex justify-between gap-x-1 sm:justify-start sm:gap-x-2'}>
      {MENU.map(({ to, label }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) => `block whitespace-nowrap ${shape} ${isActive ? ACTIVE : INACTIVE}`}
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default function Layout({ wide = false }) {
  const [search, setSearch] = useState('');
  return (
    <div className="min-h-dvh">
      <header className="border-b border-stone-200 bg-white">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 lg:gap-x-8 lg:px-6">
          <Link to="/" className="font-serif text-xl font-semibold text-stone-900 lg:w-48">
            Dictionnaire
          </Link>
          <div className="mx-auto w-full max-w-xl sm:w-auto sm:flex-1">
            <SearchBar query={search} onQueryChange={setSearch} />
          </div>
        </div>
        <nav aria-label="Menu" className="overflow-x-auto px-4 lg:hidden">
          <NavMenu />
        </nav>
      </header>
      <div className="lg:flex lg:gap-8 lg:px-6">
        <nav aria-label="Menu" className="hidden w-48 shrink-0 lg:block">
          <div className="fixed top-1/2 left-6 w-48 -translate-y-1/2">
            <NavMenu vertical />
          </div>
        </nav>
        <main className={`mx-auto w-full min-w-0 ${wide ? 'max-w-5xl' : 'max-w-3xl'} px-4 py-8`}>
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
}
