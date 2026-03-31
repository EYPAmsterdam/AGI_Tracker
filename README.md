# AGI Milestone Tracker

A mock MVP web app for tracking AGI through plain-language milestone statements, lower-level sub-questions, and sample evidence.

This is not a benchmark leaderboard. The app is built around a methodology question:

`What needs to be true for AI to be considered AGI?`

Each top-level milestone is broken into concrete sub-questions with:

- `status`
- `confidence`
- `rationale`
- sample `proofItems`

The current version is intentionally frontend-only:

- Next.js 14 + TypeScript
- Tailwind CSS
- local mock data only
- no auth
- no backend

## What's Included

- Homepage milestone board with click-to-expand detail panel
- Filterable milestones page
- Milestone detail page with clickable sub-questions and evidence panel
- Evidence explorer with filters for proof type, milestone, and sub-question
- Community suggestion form mockup
- Utility functions for milestone status, progress, and confidence derivation
- Realistic mock data for 15 capability pillars
- Internal dimension/capability coverage metadata
- Scientific-backing metadata for each granular sub-question

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deploying to GitHub Pages

This repository is configured to deploy for free on GitHub Pages using GitHub Actions.

1. Push the repository to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to the `main` branch.
5. Wait for the `Deploy to GitHub Pages` workflow to finish.

Your site will be published at:

```text
https://<your-github-user-or-org>.github.io/AGI_Tracker/
```

Notes:

- The Next.js app is exported as a static site, so GitHub Pages can host it for free.
- The build automatically uses the repository name as the subpath for project pages.
- If you later move the repo to `<account>.github.io`, the app will build at the root path automatically.

## Project Structure

```text
app/
  community/
  evidence/
  milestones/
src/
  components/
  data/
    seeds/
  lib/
  types/
```

## Methodology Notes

- Top-level milestone status is derived from sub-question status.
- Progress percent is derived from sub-question values:
  - `met = 1.0`
  - `in_progress = 0.5`
  - `not_met = 0.0`
- Top-level confidence is derived from the evidence mix:
  - stronger benchmark, leaderboard, and research coverage drives higher confidence
  - news and implementation-heavy evidence lowers confidence

## Mock Data Note

This repository is a `mock MVP`.

- Evidence items are sample evidence only.
- Source links are illustrative and structured to look realistic.
- The app is designed to feel demo-ready while remaining fully local and easy to extend.
