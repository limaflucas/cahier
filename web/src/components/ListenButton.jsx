import { speak } from '../speech.js';

export default function ListenButton({ text, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={`Écouter « ${text} »`}
      title="Écouter"
      className={`grid size-9 place-items-center rounded-full text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H2v6h4l5 4V5Z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
      </svg>
    </button>
  );
}
