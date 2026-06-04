# Feature Spec: Auth Signup

## Goal

Allow a new user to create an account with name, email, and password.

## User Story

As a visitor, I want to sign up for an account so I can access the
authenticated dashboard.

## Requirements

- User can enter name, email, and password.
- Form validates required fields.
- Email must be a valid email format.
- Password must be at least 8 characters.
- Submit button shows loading state.
- Errors are shown near the form.
- Successful signup redirects the user.

## Out of Scope

- OAuth
- Password reset
- Email verification
- Profile onboarding
- Billing
- Team invitations

## Proposed Route

```txt
app/signup/page.tsx
```

The route should stay thin and render the feature component.

## Proposed File Structure

```txt
features/auth/
  components/
    signup-form.tsx
  actions/
    signup.ts
  schemas/
    signup-schema.ts
  types.ts
```

## Component Responsibilities

### `signup-form.tsx`

- Render fields
- Handle submit state
- Display validation and server errors
- Call signup action

### `signup-schema.ts`

- Define Zod validation schema
- Export inferred TypeScript type

### `signup.ts`

- Validate input server-side
- Create user through existing auth/database layer
- Return structured success/error result

## Acceptance Criteria

- Signup page renders correctly.
- Empty form shows validation errors.
- Invalid email shows validation error.
- Short password shows validation error.
- Valid form calls signup action.
- Success path redirects user.
- Errors do not crash the page.

## Implementation Tasks

### T1 — Create signup validation schema

Files:

- `features/auth/schemas/signup-schema.ts`

Verify:

- TypeScript passes.
- Schema rejects invalid email and short password.

### T2 — Create signup form UI

Files:

- `features/auth/components/signup-form.tsx`

Verify:

- Form renders name, email, password, submit button.
- Loading and error states are represented.

### T3 — Create signup server action

Files:

- `features/auth/actions/signup.ts`

Verify:

- Server action validates input.
- Server action returns structured result.

### T4 — Add signup route

Files:

- `app/signup/page.tsx`

Verify:

- Route renders the signup form.
- Page stays thin.

## Agent Implementation Prompt

Implement T1 only from `apps/web/docs/feature-specs/01-auth-signup.md`.

Before coding:

1. Read `apps/web/docs/AGENTS.md`
2. Read `apps/web/docs/progress-tracker.md`
3. Read this feature spec

After coding:

1. Update `apps/web/docs/progress-tracker.md`
2. Do not implement T2 until asked
