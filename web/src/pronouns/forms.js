export const PERSONS = ['je', 'tu', 'il · elle · on', 'nous', 'vous', 'ils · elles'];

/**
 * A pronoun form, keyed so that the table can point at it and the section can highlight it.
 * @param {string} form
 * @param {{ elided?: string, key?: string }} [options] the form before a vowel, and a key when the form alone is ambiguous
 * @returns {{ key: string, form: string, elided?: string }}
 */
export const f = (form, { elided, key = form } = {}) => (elided ? { key, form, elided } : { key, form });
