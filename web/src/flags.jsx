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
 * Every feature flag the server reported for this visitor. Empty until they have loaded.
 * @returns {Record<string, boolean>}
 */
export const useFlags = () => useContext(FlagsContext);

/**
 * Whether a feature flag is on for this visitor. Off until the flags have loaded.
 * @param {string} name
 * @returns {boolean}
 */
export const useFlag = (name) => useFlags()[name] === true;

/**
 * Renders its children only while the flag is on.
 * @param {{ name: string, children: import('react').ReactNode }} props
 */
export function Flagged({ name, children }) {
  return useFlag(name) ? children : null;
}
