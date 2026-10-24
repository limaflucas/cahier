import { genderLabel, posLabel } from '../labels.js';

export default function Classification({ pos, gender }) {
  return (
    <>
      <span className="font-semibold text-stone-900">{posLabel(pos)}</span>
      {gender && <span className="italic text-stone-500"> · {genderLabel(gender)}</span>}
    </>
  );
}
