import { initialize } from 'unleash-client';

const ON = new Set(['on', 'true', '1']);
const OFF = new Set(['off', 'false', '0']);

/**
 * Evaluates feature flags. An override wins, then Unleash; anything else is off.
 * @param {object} [options]
 * @param {{ isEnabled(name: string, context: object, fallback: boolean): boolean,
 *   getFeatureToggleDefinitions(): { name: string }[] } | null} [options.client] Unleash client
 * @param {Record<string, boolean>} [options.overrides] forced states, see parseOverrides
 */
export function createFlags({ client = null, overrides = {} } = {}) {
  /**
   * @param {string} name
   * @param {object} context Unleash context of the visitor
   * @returns {boolean}
   */
  const isEnabled = (name, context) =>
    Object.hasOwn(overrides, name) ? overrides[name] : (client?.isEnabled(name, context, false) ?? false);

  /**
   * @param {object} context Unleash context of the visitor
   * @returns {Record<string, boolean>} every known flag, evaluated for that visitor
   */
  const snapshot = (context) => {
    const names = new Set([
      ...(client?.getFeatureToggleDefinitions() ?? []).map(({ name }) => name),
      ...Object.keys(overrides),
    ]);
    return Object.fromEntries([...names].map((name) => [name, isEnabled(name, context)]));
  };

  return { isEnabled, snapshot };
}

/**
 * Parses FLAGS_OVERRIDE, a comma-separated list like "new-quiz=on,beta=off".
 * @param {string} [text]
 * @returns {Record<string, boolean>}
 */
export function parseOverrides(text = '') {
  return Object.fromEntries(
    text.split(',').map((entry) => entry.trim()).filter(Boolean).map((entry) => {
      const [name, value = ''] = entry.split('=').map((part) => part.trim());
      if (ON.has(value)) return [name, true];
      if (OFF.has(value)) return [name, false];
      throw new Error(`FLAGS_OVERRIDE: expected name=on|off, got "${entry}"`);
    }),
  );
}

/**
 * Connects to Unleash when UNLEASH_URL and UNLEASH_API_TOKEN are set.
 * @param {Record<string, string | undefined>} [env]
 * @param {{ warn(message: string): void }} [logger]
 * @returns {import('unleash-client').Unleash | null}
 */
export function createUnleashClient({ UNLEASH_URL, UNLEASH_API_TOKEN, UNLEASH_APP_NAME = 'cahier' } = process.env, logger = console) {
  if (!UNLEASH_URL || !UNLEASH_API_TOKEN) return null;
  const client = initialize({ url: UNLEASH_URL, appName: UNLEASH_APP_NAME, customHeaders: { Authorization: UNLEASH_API_TOKEN } });
  client.on('error', (err) => logger.warn(`unleash: ${err.message}`));
  return client;
}
