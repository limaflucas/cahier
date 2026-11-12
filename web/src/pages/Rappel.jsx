import { Link } from 'react-router-dom';
import ReviewSession from '../components/games/ReviewSession.jsx';
import RappelCard from '../components/rappel/RappelCard.jsx';

/** Rappel: today's saved words to type from memory. */
export default function Rappel() {
  return (
    <ReviewSession
      title="Rappel"
      path="/rappel"
      Card={RappelCard}
      empty={
        <p className="mt-8 text-stone-600">
          Aucun mot à réviser.{' '}
          <Link to="/mes-mots" className="font-medium text-blue-700 hover:underline">Voir mes mots</Link>
        </p>
      }
    />
  );
}
