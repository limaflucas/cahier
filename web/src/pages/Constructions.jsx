import { Link, Navigate, NavLink, useParams } from 'react-router-dom';
import PrepositionCard from '../components/constructions/PrepositionCard.jsx';
import ReviewSession from '../components/games/ReviewSession.jsx';

/**
 * How many saved verbs still wait for their constructions, if any.
 * @param {{ count: number }} props
 */
function Preparing({ count }) {
  if (count === 0) return null;
  return (
    <p className="mt-4 text-sm text-stone-500">
      {count === 1 ? '1 verbe' : `${count} verbes`} en préparation : revenez dans quelques minutes.
    </p>
  );
}

const GAMES = {
  prepositions: {
    label: 'Prépositions',
    Card: PrepositionCard,
    nothing: 'Aucune construction à réviser.',
    notes: (start) => <Preparing count={start.preparing} />,
  },
};

const ACTIVE = 'border-blue-600 font-semibold text-blue-700';
const INACTIVE = 'border-transparent font-medium text-stone-500 hover:text-stone-900';

/** The tabs between the Constructions games. */
function Tabs() {
  return (
    <nav aria-label="Constructions" className="mt-4 flex gap-6 border-b border-stone-200">
      {Object.entries(GAMES).map(([game, { label }]) => (
        <NavLink
          key={game}
          to={`/constructions/${game}`}
          className={({ isActive }) => `-mb-px border-b-2 pb-2 text-sm ${isActive ? ACTIVE : INACTIVE}`}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Constructions: the review games about how saved words combine, one tab each. */
export default function Constructions() {
  const { game } = useParams();
  if (!GAMES[game]) return <Navigate to="/constructions/prepositions" replace />;
  const { Card, nothing, notes } = GAMES[game];
  return (
    <ReviewSession
      key={game}
      title="Constructions"
      tabs={<Tabs />}
      path={`/constructions/${game}`}
      Card={Card}
      notes={notes}
      empty={
        <p className="mt-8 text-stone-600">
          {nothing}{' '}
          <Link to="/mes-mots" className="font-medium text-blue-700 hover:underline">Voir mes mots</Link>
        </p>
      }
    />
  );
}
