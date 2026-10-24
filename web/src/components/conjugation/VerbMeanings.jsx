import { useId, useLayoutEffect, useRef, useState } from 'react';
import { api } from '../../api.js';
import { useApi } from '../../useApi.js';
import { verbSections } from '../../conjugation/meanings.js';
import PosSection from '../PosSection.jsx';

const VIEWPORT_GUTTER = 16;

/**
 * The verb's dictionary sections, or why they are missing.
 * @param {{ state: { status: string, data?: object }, verb: string }} props
 */
function Meanings({ state, verb }) {
  if (state.status === 'loading') return <p className="text-sm text-stone-500">Recherche des sens…</p>;
  const sections = state.status === 'done' ? verbSections(state.data, verb) : [];
  if (sections.length === 0) return <p className="text-sm text-stone-500">Sens indisponibles pour le moment.</p>;
  return sections.map((section, i) => <PosSection key={i} section={section} />);
}

/**
 * An icon that shows the verb's meanings, as the search page lists them, while hovered or focused.
 * @param {{ verb: string, className?: string }} props
 */
export default function VerbMeanings({ verb, className = '' }) {
  const state = useApi((signal) => api.lookup(verb, signal), [verb]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shift, setShift] = useState(0);
  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();
  const label = `Sens de « ${verb} »`;
  const open = hovered || focused;

  useLayoutEffect(() => {
    if (!open) return;
    const overflow = anchorRef.current.getBoundingClientRect().left + panelRef.current.offsetWidth + VIEWPORT_GUTTER - window.innerWidth;
    setShift(-Math.max(overflow, 0));
  }, [open]);

  function close(event) {
    if (event.key !== 'Escape') return;
    setHovered(false);
    setFocused(false);
  }

  return (
    <div ref={anchorRef} className={`relative ${className}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        type="button"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={() => setHovered(true)}
        onKeyDown={close}
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        className="grid size-9 place-items-center rounded-full text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2Z" />
          <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7Z" />
        </svg>
      </button>
      <div id={panelId} hidden={!open} style={{ left: shift }} className="absolute top-full z-20 pt-1">
        <div
          ref={panelRef}
          role="region"
          aria-label={label}
          className="max-h-[70vh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-stone-200 bg-white p-4 shadow-lg [&>section:first-child]:mt-0"
        >
          <Meanings state={state} verb={verb} />
        </div>
      </div>
    </div>
  );
}
