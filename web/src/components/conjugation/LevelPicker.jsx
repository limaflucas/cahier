import { LEVELS } from '../../conjugation/game.js';

const describe = ({ prefilled }) => (prefilled > 0 ? `${Math.round(prefilled * 100)} % rempli` : 'tout à remplir');

export default function LevelPicker({ value, onChange }) {
  return (
    <fieldset>
      <legend className="sr-only">Niveau</legend>
      <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5">
        {LEVELS.map((level) => {
          const checked = level.id === value;
          return (
            <label
              key={level.id}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm has-focus-visible:outline-2 has-focus-visible:outline-blue-600 ${
                checked ? 'bg-blue-700 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <input
                type="radio"
                name="niveau"
                value={level.id}
                checked={checked}
                onChange={() => onChange(level.id)}
                className="sr-only"
              />
              <span className="font-medium">{level.label}</span>
              <span className={`ml-1.5 hidden text-xs whitespace-nowrap sm:inline ${checked ? 'text-blue-100' : 'text-stone-500'}`}>
                {describe(level)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
