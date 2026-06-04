# Feature Spec: Checkout remote (optional third MFE)

## Status

**Draft** — optional; approve only if you want a three-team interview story.

## Goal

Add a third federated remote for checkout summary / place-order mock, loaded on `/checkout` in the shell.

## User story

As a shopper, I want a checkout step owned by a separate team so the demo shows three domains: catalog, cart, checkout.

## Requirements

- [ ] New app `apps/mfe-checkout` (or `mfe-checkout` package name) on port **5176**
- [ ] Exposes `./CheckoutPage` with `RemoteSlotProps`
- [ ] Shell route `/checkout` lazy-loads remote with same error boundary pattern
- [ ] Shell `vite.config.ts` remote entry `http://localhost:5176/remoteEntry.js`
- [ ] Turbo `dev` / `build` include new app
- [ ] Mock “Place order” button shows success message (no payment)

## Out of scope

- Stripe / real payments
- Shared cart state with `mfe-cart` (display static summary or props-only mock order — document gap)
- SSR

## Architecture impact

- Apps: new `mfe-checkout`, `shell`
- Packages: `mfe-shared` unchanged unless new types needed
- New package: no

## Proposed file structure

```txt
apps/mfe-checkout/
  package.json
  vite.config.ts
  src/
    features/checkout/
      components/
        checkout-page.tsx
    checkout-page.tsx         # federation re-export
apps/shell/
  vite.config.ts              # add mfe_checkout remote
  src/features/checkout-route/
```

## Acceptance criteria

- [ ] `bun run dev` starts four servers (or three remotes + shell)
- [ ] `/checkout` loads checkout remote
- [ ] README and `architecture.md` updated with port 5176

## Implementation tasks

### T1 — Scaffold mfe-checkout app

Files:

- Copy structure from `mfe-cart` with new name/port
- Register in root `package.json` workspaces (automatic via `apps/*`)

Verify:

- `http://localhost:5176` standalone works

### T2 — Shell integration

Files:

- Shell federation config + route + nav link

Verify:

- Full flow shell → checkout remote

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/06-checkout-remote.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update this spec and `00-index.md` if needed; stop before T2 unless the user asks to continue.
