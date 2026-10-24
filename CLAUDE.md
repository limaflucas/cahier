# Cahier

Personal French study notebook. Express 4 + node:sqlite API, React 19 + Vite SPA, Unleash feature flags.

## Rules

- **Trunk-based:** `master` is the trunk and is protected. Every feature starts on its own short-lived branch, before any test or code. Open a PR on `gitea.homelab/homelab/cahier` and hand it over once CI is green: the user approves and squash-merges every PR. Never push to `master`; never approve or merge a PR.
- **Feature flags:** unfinished or risky work merges behind an Unleash flag that defaults to off. Remove the flag once the feature is fully rolled out.
  - Server: `flags.isEnabled(name, context)`; browser: `useFlag(name)` (from `GET /api/flags`).
  - Precedence: `FLAGS_OVERRIDE` (`name=on|off,…`, an emergency kill switch) → Unleash → off.
  - Unleash at https://unleash.cahier.homelab: environments `development` (local `.env`) and `production`. The context carries `sessionId` (sticky cookie), `remoteAddress` and `userAgent`, for gradual rollouts and constraints.
- **Test first, every feature:**
  1. Design and write unit, smoke and e2e tests for it.
  2. Run them; they must all fail.
  3. Implement the feature.
  4. Run them again; they must all pass.
  5. Never change an existing test without the user's consent, and never ask before running it: when a test fails, report which one, why it failed and the proposed correction, then wait.
- **Secrets:** never commit or push keys, tokens or passwords, not even in tests or docs. They live in Docker swarm secrets. The `pre-commit` hook and CI run gitleaks.
- **Style:** code that speaks for itself; comments only when unavoidable. JSDoc on every function and class.

## Layout

- `server/`, `web/`: API and SPA.
- `test/*.test.js`: unit (`npm run test:unit`).
- `scripts/import-data.js`, `scripts/migrate-to-homelab.sh`: merge an older install into this one (idempotent).
- `deploy/`: swarm stacks, act_runner config, Komodo resources (`deploy/komodo/*.toml`, applied by the `cahier` Resource Sync).
- `test/smoke/`: smoke against `BASE_URL` (`npm run test:smoke`); `test/e2e/`: Playwright (`npm run test:e2e`).
- `.gitea/workflows/`: CI (gitleaks, unit, e2e, smoke), post-deploy smoke, GitHub mirror.

## Deploy

A merge to `master` fires the Gitea webhook → Komodo procedure `cahier-deploy` (sync, then `cahier-rollout`: build → deploy). Keep `cahier-deploy` unchanged: a sync cannot update the procedure running it. The `deploy` workflow then waits for https://cahier.homelab/api/version to report the merged commit and runs the smoke suite against it.
