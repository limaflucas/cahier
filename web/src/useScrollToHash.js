import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the element named in the URL hash, and again whenever `ready` changes.
 * @param {unknown} [ready] a value that changes once late content has rendered
 */
export function useScrollToHash(ready) {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash, ready]);
}
