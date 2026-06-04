# Product Requirements Document

## Product

AI Resume Builder

## Summary

An application that helps job seekers create tailored resumes for specific job descriptions using AI.

Users can upload an existing resume, paste a job description, and generate a customized version optimized for that role.

---

## Problem

Most job seekers spend a significant amount of time manually tailoring resumes for each application.

This process is repetitive and often results in inconsistent quality.

---

## Target Users

### Primary

Experienced software engineers applying to multiple jobs.

### Secondary

General job seekers who want AI assistance when creating resumes.

---

## Core User Flows

### Resume Upload

1. User uploads a resume.
2. Resume is parsed.
3. Resume data is stored.

### Job Analysis

1. User pastes a job description.
2. AI analyzes requirements.
3. Key skills and technologies are extracted.

### Resume Generation

1. User selects a resume.
2. User selects a job description.
3. AI generates a tailored version.
4. User reviews and edits before exporting.

---

## Success Criteria

A user can:

* Upload a resume.
* Analyze a job description.
* Generate a tailored resume.
* Export the final document.

---

## Non Goals

Not in scope:

* Automatic job applications.
* Recruiter CRM.
* Team collaboration.
* Billing.
* Candidate tracking system.

---

## Technical Constraints

* Next.js App Router
* TypeScript
* Tailwind
* OpenAI API
* PostgreSQL

---

## Current State

Implemented:

* Resume upload
* Resume storage

Planned:

* Job analysis
* Resume tailoring
* Export workflow

Future:

* Cover letter generation
* Interview preparation
