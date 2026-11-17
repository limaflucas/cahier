import { Link } from 'react-router-dom';
import { GRAMMAR_PAGES } from '../grammar/index.js';
import Complements from '../components/grammar/Complements.jsx';

/** The list of grammar pages. */
export default function Grammaire() {
  return (
    <>
      <header>
        <h1 className="font-serif text-4xl font-semibold text-stone-900">Grammaire</h1>
        <p className="mt-3 text-lg text-stone-700">
          Des fiches pour comprendre une règle, la reconnaître dans une phrase et l'appliquer, avec la traduction en portugais.
        </p>
        <p lang="pt" className="mt-1 text-blue-800">
          Fichas para entender uma regra, reconhecê-la numa frase e aplicá-la, com tradução para o português.
        </p>
      </header>

      <ul aria-label="Fiches de grammaire" className="mt-8 space-y-3">
        {GRAMMAR_PAGES.map(({ to, title, blurb }) => (
          <li key={to} className="relative rounded-xl border border-stone-200 bg-white p-4 hover:border-blue-300">
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              <Link to={to} className="after:absolute after:inset-0 hover:text-blue-700">{title}</Link>
            </h2>
            <p className="mt-1 text-stone-700"><Complements text={blurb.fr} /></p>
            <p lang="pt" className="text-sm text-blue-800">{blurb.pt}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
