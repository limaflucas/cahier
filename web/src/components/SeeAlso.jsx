import { Link } from 'react-router-dom';

/**
 * A link to a related rule, on this page or another one.
 * @param {{ see: { to: string, label: string } }} props
 */
export default function SeeAlso({ see }) {
  return (
    <p className="mt-3 text-sm">
      <Link to={see.to} className="font-medium text-blue-700 hover:text-blue-900">
        {see.label} <span aria-hidden="true">→</span>
      </Link>
    </p>
  );
}
