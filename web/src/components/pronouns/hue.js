/**
 * Sets the family hue that the TINT and WASH classes read.
 * @param {number} hue
 * @returns {Record<string, number>}
 */
export const hueStyle = (hue) => ({ '--h': hue });

export const TINT = 'border border-[hsl(var(--h)_80%_80%)] bg-[hsl(var(--h)_80%_91%)] text-[hsl(var(--h)_55%_28%)]';

export const WASH = 'bg-[hsl(var(--h)_70%_97.5%)]';

export const TINT_HOVER = 'hover:bg-[hsl(var(--h)_80%_91%)]';
