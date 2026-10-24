import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const FlagsContext = createContext({});

/**
 * Loads the visitor's feature flags once and shares them with the tree.
 * @param {{ children: import('react').ReactNode }} props
 */
export function FlagsProvider({ children }) {
  const [flags, setFlags] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    api.flags(controller.signal).then(setFlags, () => {});
    return () => controller.abort();
  }, []);

  return <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>;
}

/**
 * Whether a feature flag is on for this visitor. Off until the flags have loaded.
 * @param {string} name
 * @returns {boolean}
 */
export const useFlag = (name) => useContext(FlagsContext)[name] === true;
