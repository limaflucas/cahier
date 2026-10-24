export default function YouglishLink({ word, className = '' }) {
  return (
    <a
      href={`https://youglish.com/pronounce/${encodeURIComponent(word)}/french`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Écouter « ${word} » dans des vidéos sur YouGlish (nouvel onglet)`}
      title="Écouter sur YouGlish"
      className={`grid size-9 place-items-center rounded-full text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="4" />
        <path d="m10 9 5 3-5 3Z" />
      </svg>
    </a>
  );
}
