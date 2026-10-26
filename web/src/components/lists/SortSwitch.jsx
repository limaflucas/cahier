/**
 * A pair of toggle buttons choosing how a page is sorted.
 * @param {{ value: string, onChange(value: string): void, options: { value: string, label: string }[] }} props
 */
export default function SortSwitch({ value, onChange, options }) {
  return (
    <div role="group" aria-label="Trier" className="inline-flex rounded-full border border-stone-200 bg-white p-0.5 text-sm">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-3 py-1 font-medium ${option.value === value ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
