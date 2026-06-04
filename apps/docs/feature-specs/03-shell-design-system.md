# Feature Spec: Shell design system integration

## Status

**Completed** — T1–T2 implemented.

## Goal

Use `@repo/design-system` for shell chrome (layout, nav, home) so the host looks polished and demonstrates “shared design system reduces drift.”

## User story

As a visitor, I want the shell to use consistent UI components so the app feels like a real product host, while remotes can catch up later.

## Requirements

- [x] Shell imports `DesignSystemProvider` (or equivalent) from `@repo/design-system` at root
- [x] Shell layout/nav use design-system `Button`, typography patterns, or existing primitives (minimum: consistent spacing/colors via DS + tokens)
- [x] Tailwind/PostCSS configured in `apps/shell` to support design-system styles (match patterns from next-forge if needed)
- [x] Home page uses at least two design-system components (e.g. `Card`, `Button`)
- [x] Remotes **unchanged** in this spec (still `mfe-shared` tokens only)

## Out of scope

- Federated design-system remote
- Restyling `mfe-products` / `mfe-cart`
- Dark mode toggle unless trivial via existing `ModeToggle`
- Clerk / real auth

## Architecture impact

- Apps: `shell` only
- Packages: `@repo/design-system`, `@repo/neon-auth` (transitive via `DesignSystemProvider` — passthrough until sign-in UI)
- New package: no

## Proposed file structure

```txt
apps/shell/
  package.json              # add @repo/design-system
  postcss.config.mjs        # if required
  src/
    main.tsx                # wrap with DesignSystemProvider
    features/shell-chrome/
      components/
        shell-layout.tsx    # DS components
    features/home/
      components/
        home-page.tsx
```

## Acceptance criteria

- [x] Shell visually uses design-system components on `/` and nav
- [x] No duplicate React errors (federation shared config unchanged)
- [x] `bun run build --filter=shell` passes
- [x] `cd apps/shell && bun run typecheck` passes

## Implementation tasks

### T1 — Dependencies and provider

Files:

- `apps/shell/package.json`
- `apps/shell/postcss.config.mjs` (create if missing)
- `apps/shell/src/main.tsx`

Verify:

- Shell renders without style/runtime errors

### T2 — Layout and home with DS components

Files:

- `features/shell-chrome/components/shell-layout.tsx`
- `features/home/components/home-page.tsx`

Verify:

- Nav links work; home page shows DS-styled content

## Agent implementation prompt

Implement **T1 only** from `apps/docs/feature-specs/03-shell-design-system.md`.

Before coding: read `apps/docs/AGENTS.md` and this spec.

After coding: update this spec and `00-index.md` if needed; stop before T2 unless the user asks to continue.
