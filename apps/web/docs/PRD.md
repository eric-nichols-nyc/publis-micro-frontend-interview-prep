
# Product Requirements Document

## Product

Example SaaS Web App

## Purpose

A web application where users can create accounts, sign in, and access a protected dashboard.

## Primary Users

- Visitor: can view marketing pages and create an account.
- Authenticated user: can access dashboard features.

## Core Flows

1. Visitor opens the signup page.
2. Visitor creates an account with name, email, and password.
3. App validates input.
4. Account is created.
5. User is redirected to dashboard or sign-in page.

## Non-Goals

- OAuth login
- Password reset
- Billing
- Team accounts
- Admin roles

## Technical Direction

- Use feature-based organization.
- Keep auth UI in `features/auth`.
- Keep validation with Zod.
- Do not add OAuth until a future spec defines it.

