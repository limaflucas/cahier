import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FAMILIES, VIDEO_URL } from '../pronouns/index.js';
import FamilySection from '../components/pronouns/FamilySection.jsx';
import PronounTable from '../components/pronouns/PronounTable.jsx';

const HIGHLIGHT_MS = 2500;

/**
 * Brings an anchor of the page into view, smoothly unless the visitor prefers less motion.
 * @param {string} id
 * @param {boolean} smooth
 */
function scrollToAnchor(id, smooth) {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: smooth && !reduced ? 'smooth' : 'auto' });
}

/**
 * The form picked in the table, cleared a moment after each pick.
 * @returns {[{ family: string, key: string } | null, (value: { family: string, key: string } | null) => void]}
 */
function useHighlight() {
  const [highlight, setHighlight] = useState(null);
  useEffect(() => {
    if (!highlight) return undefined;
    const timer = setTimeout(() => setHighlight(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlight]);
  return [highlight, setHighlight];
}

/** The pronouns reference page: one table of every pronoun, then each family's explanation. */
export default function Pronoms() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [highlight, setHighlight] = useHighlight();

  useEffect(() => {
    if (hash) scrollToAnchor(decodeURIComponent(hash.slice(1)), false);
  }, []);

  const pick = useCallback((id, key) => {
    navigate({ hash: `#${id}` }, { replace: window.location.hash === `#${id}` });
    scrollToAnchor(id, true);
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
    setHighlight(key ? { family: id, key } : null);
  }, [navigate, setHighlight]);

  return (
    <>
      <header className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-stone-900">Pronoms</h1>
        <p className="mt-3 text-lg text-stone-700">
          Les onze familles de pronoms réunies dans un seul tableau : à quoi elles servent, où les placer, et les nuances
          des niveaux B2 et C1.
        </p>
        <p lang="pt" className="mt-1 text-blue-800">
          As onze famílias de pronomes numa só tabela: para que servem, onde colocá-las e as nuances dos níveis B2 e C1.
        </p>
        <p className="mt-3 text-sm text-stone-500">
          D'après la vidéo{' '}
          <a href={VIDEO_URL} target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900">
            All 11 French Pronouns in One Video!
          </a>{' '}
          (French Time)
        </p>
      </header>

      <PronounTable onPick={pick} />

      <div className="mt-14 max-w-3xl space-y-14">
        {FAMILIES.map((family) => (
          <FamilySection
            key={family.id}
            family={family}
            highlighted={highlight?.family === family.id ? highlight.key : null}
            onPick={pick}
          />
        ))}
      </div>
    </>
  );
}
