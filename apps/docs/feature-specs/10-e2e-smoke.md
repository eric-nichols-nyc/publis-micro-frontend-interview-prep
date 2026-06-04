# Feature Spec: E2E smoke tests

## Status

**Draft** — approve when adding Playwright to the repo.

## Goal

Automated smoke test: shell loads, federated routes render, basic navigation works — catches broken `remoteEntry` or routing regressions.

## User story

As a maintainer, I want CI to verify the integrated MFE app so independent remote deploys do not break the shell silently.

## Requirements

- [ ] Playwright (or existing monorepo test runner) configured at repo root or `apps/shell`
- [ ] Test script starts remotes + shell (or uses `preview` against prebuilt `dist/`)
- [ ] Tests: home loads, `/products` contains catalog marker, `/cart` contains cart marker
- [ ] Optional: nav between routes
- [ ] Document CI requirement in README (GitHub Actions outline OK as markdown only in T1)
- [ ] `turbo test` or `bun run test:e2e` wired at root

## Out of scope

- Visual regression
- Testing remote failure fallback (flaky — manual demo only)
- Full Clerk auth E2E

## Architecture impact

- Apps: `shell` test project; may need `webServer` config launching turbo dev
- Packages: none
- New package: no

## Acceptance criteria

- [ ] `bun run test:e2e` (or documented command) passes locally with dev/preview setup
- [ ] Failing remote URL causes test failure (proves integration tested)

## Implementation tasks

### T1 — Playwright setup + one smoke test

Files:

- `apps/shell/playwright.config.ts` (or root)
- `apps/shell/e2e/shell-smoke.spec.ts`
- Root `package.json` script `test:e2e`

Verify:

- Single test passes with `bun run dev` running (document manual CI later)

### T2 — CI workflow file (optional)

Files:

- `.github/workflows/e2e-mfe.yml`

Verify:

- Workflow documented; may run on PR if secrets/ports allow

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/10-e2e-smoke.md`.

Before coding: read `apps/docs/AGENTS.md`, `progress-tracker.md`, this spec.

After coding: update `progress-tracker.md`; stop before T2.
