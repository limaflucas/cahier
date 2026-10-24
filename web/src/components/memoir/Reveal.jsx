import { Link } from 'react-router-dom';
import Classification from '../Classification.jsx';
import LevelBadge from '../LevelBadge.jsx';
import ListenButton from '../ListenButton.jsx';
import Phrase from './Phrase.jsx';

export default function Reveal({ word, reveal, correct }) {
  const { pos, gender, level, definition, translations, example } = reveal;
  return (
    <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4">
      <p role="status" className={`text-sm font-semibold ${correct ? 'text-emerald-700' : 'text-rose-700'}`}>
        {correct ? 'Bonne réponse !' : 'Pas cette fois.'}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3">
        <Link to={`/mot/${encodeURIComponent(word)}`} lang="fr" className="font-serif text-2xl text-stone-900 hover:text-blue-700">
          {word}
        </Link>
        <ListenButton text={word} />
        <span className="text-sm">
          <Classification pos={pos} gender={gender} />
        </span>
        {level && <LevelBadge level={level} />}
      </div>
      <p lang="fr" className="mt-2 text-stone-900">{definition}</p>
      <p lang="pt" className="mt-0.5 font-medium text-blue-800">{translations.join(', ')}</p>
      {example && (
        <div className="mt-3 space-y-1 border-l-2 border-stone-200 pl-3 font-serif italic text-stone-600">
          <p lang="fr"><Phrase text={example.fr} /></p>
          {example.pt && <p lang="pt"><Phrase text={example.pt} /></p>}
        </div>
      )}
    </div>
  );
}
