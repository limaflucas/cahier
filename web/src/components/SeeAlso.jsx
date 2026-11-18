import { Link } from 'react-router-dom';
import { Flagged } from '../flags.jsx';

/**
 * A link to a related rule, on this page or another one; behind a flag, it shows only while the flag is on.
 * @param {{ see: { to: string, label: string, flag?: string } }} props
 */
export default function SeeAlso({ see }) {
  const link = (
    <p className="mt-3 text-sm">
      <Link to={see.to} className="font-medium text-blue-700 hover:text-blue-900">
        {see.label} <span aria-hidden="true">→</span>
      </Link>
    </p>
  );
  return see.flag ? <Flagged name={see.flag}>{link}</Flagged> : link;
}
