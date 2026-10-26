/**
 * The pencil that opens a list's inline rename.
 * @param {{ name: string, onClick(): void }} props
 */
export default function RenameButton({ name, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Renommer « ${name} »`}
      title="Renommer"
      className="grid size-8 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-blue-600"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    </button>
  );
}
