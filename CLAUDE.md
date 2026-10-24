# Cahier

Personal French study notebook. Express 4 + node:sqlite API, React 19 + Vite SPA, Unleash feature flags.

## Rules

- **Trunk-based:** `master` is the trunk and is protected. Work on a short-lived branch, open a PR on `gitea.homelab/homelab/cahier`, squash-merge once CI is green. Never push to `master`.
- **Feature flags:** unfinished or risky work merges behind an Unleash flag that defaults to off. Remove the flag once the feature is fully rolled out.
- **Test first, every feature:**
  1. Design and write unit, smoke and e2e tests for it.
  2. Run them; they must all fail.
  3. Implement the feature.
  4. Run them again; they must all pass.
  5. Never change an existing test without the user's consent.
- **Secrets:** never commit or push keys, tokens or passwords, not even in tests or docs. They live in Docker swarm secrets. The `pre-commit` hook and CI run gitleaks.
- **Style:** code that speaks for itself; comments only when unavoidable. JSDoc on every function and class.

## Layout

- `server/`, `web/`: API and SPA.
- `test/*.test.js`: unit (`npm run test:unit`).
- `deploy/`: swarm stacks, act_runner config, Komodo resources (`deploy/komodo/*.toml`, applied by the `cahier` Resource Sync).
- `.gitea/workflows/`: CI, GitHub mirror.

## Deploy

A merge to `master` fires the Gitea webhook → Komodo procedure `cahier-deploy` (sync → build → deploy).
