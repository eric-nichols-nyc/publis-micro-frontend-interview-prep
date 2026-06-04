# Feature Spec: Production remote URLs

## Status

**Completed** — T1–T2 (2026-06-04).

## Goal

Document and implement environment-specific remote URLs for shell builds and a local preview workflow that mirrors production federation loading.

Interview note: [production-remote-urls.md](../notes/production-remote-urls.md).

## User story

As a deployer, I want the shell to load remotes from staging/production URLs via env vars so each MFE deploys independently.

## Requirements

- [x] `apps/shell/.env.example` documents `VITE_MFE_PRODUCTS_URL`, `VITE_MFE_CART_URL` (and checkout if **06** exists)
- [x] `vite.config.ts` reads env with sensible dev defaults (already partial — verify and document)
- [x] `apps/docs/architecture.md` section: deploy order (deploy remotes → deploy shell)
- [x] Script or README steps: `build` remotes → `preview` → `build` shell with env pointing at preview URLs
- [x] Optional: `turbo.json` task notes for CI matrix per app

## Out of scope

- Actual Vercel/AWS deploy configs
- Version negotiation / runtime manifest pinning (mention as future)

## Architecture impact

- Apps: `shell` (primary), docs
- Packages: none
- New package: no

## Acceptance criteria

- [x] Shell build with custom env URLs succeeds when preview URLs valid
- [x] README “Production remote URLs” matches implemented env names
- [x] Interview guide mentions CDN caching for `remoteEntry.js`

## Implementation tasks

### T1 — Env example + config audit

Files:

- `apps/shell/.env.example`
- `apps/shell/vite.config.ts` (comments only if already correct)

Verify:

- Documented vars match vite config

### T2 — Preview workflow in README

Files:

- `README.md`, `apps/docs/interview-guide.md`

Verify:

- Another developer can follow steps locally

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/09-prod-remote-env.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update this spec and `00-index.md` if needed; stop before T2 unless the user asks to continue.
