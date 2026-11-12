import { Fragment } from 'react';
import Classification from './Classification.jsx';

/**
 * A word's parts of speech and genders, comma separated.
 * @param {{ classifications: { pos: string, gender: string | null }[] }} props
 */
export default function Classifications({ classifications }) {
  return (
    <span className="text-sm">
      {classifications.map(({ pos, gender }, i) => (
        <Fragment key={`${pos}:${gender}`}>
          {i > 0 && <span className="text-stone-400">, </span>}
          <Classification pos={pos} gender={gender} />
        </Fragment>
      ))}
    </span>
  );
}
