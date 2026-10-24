# Cahier

A personal French study notebook: dictionary lookups, saved words, conjugation drills and memory quizzes.

Source: `gitea.homelab/homelab/cahier`, mirrored to GitHub.

## Develop

```bash
npm install          # also installs the git hooks (gitleaks on commit, no pushes to master)
cp .env.example .env
npm run dev          # API on :3000, Vite on :5173
```

## Test

```bash
npm run test:unit
npm run test:e2e                              # Playwright, against the production build
BASE_URL=http://localhost:3000 npm run test:smoke
```

## Ship

Trunk-based: branch, PR, green CI, squash-merge. Unfinished work hides behind an Unleash flag at https://unleash.homelab, shared with the other homelab apps. The merge deploys to https://cahier.homelab.

## Move data from another install

```bash
scripts/migrate-to-homelab.sh data/french.db   # into https://cahier.homelab, safe to re-run
node scripts/import-data.js old.db new.db      # between two local files
```
