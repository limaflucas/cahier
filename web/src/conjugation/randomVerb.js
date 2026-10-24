import { api } from '../api.js';

export const NO_SAVED_VERBS = "Aucun verbe dans Mes mots pour l'instant. Tapez un verbe ou ajoutez-en depuis le dictionnaire.";

export async function pickSavedVerb(exclude) {
  try {
    return { verb: (await api.randomVerb(exclude)).verb };
  } catch (error) {
    return { error: error.status === 404 ? NO_SAVED_VERBS : 'Impossible de choisir un verbe pour le moment.' };
  }
}

export const gamePath = (verb, level) => `/conjugaison/${encodeURIComponent(verb)}?niveau=${level}`;
