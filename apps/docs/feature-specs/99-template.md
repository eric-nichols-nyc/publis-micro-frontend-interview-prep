# Feature Spec: [Feature Name]

## Goal

What are we building?

## User Story

As a [user], I want [action], so that [benefit].

## Requirements

- [ ] Requirement 1
- [ ] Requirement 2

## Out of Scope

- Thing not included

## Architecture impact

- Apps affected: `shell` / `mfe-products` / `mfe-cart` / `mfe-shared`
- New package needed? (yes/no — e.g. `mfe-auth` only if justified)

## Proposed file structure

Use the feature folder pattern and kebab-case file names (see `apps/docs/AGENTS.md`).

```txt
apps/shell/src/features/<feature-name>/components/...
apps/shell/src/pages/<route-page>.tsx          # thin — wires route to feature
apps/mfe-products/src/features/<feature-name>/components/...
packages/mfe-shared/src/...
```

## Acceptance criteria

- [ ] Behavior verified in browser
- [ ] `bun run build` passes for affected apps
- [ ] `typecheck` passes for affected apps
- [ ] `progress-tracker.md` updated

## Implementation tasks

### T1 — First small task

Files:

- `path/to/file`

Verify:

- How to confirm it works

## Agent implementation prompt

Implement T1 only from this spec.

Before coding:

1. Read `apps/docs/AGENTS.md`
2. Read `apps/docs/progress-tracker.md`
3. Read this spec

After coding:

1. Update `progress-tracker.md`
2. Stop before T2 unless the user asks to continue
