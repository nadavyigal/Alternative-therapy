# Epic 2 - Profiles & Directory

## Overview
Create the therapist profile experience and public directory so clients can discover and contact therapists.

## Scope
- Therapist profile schema and CRUD.
- Modalities and issues taxonomy with many-to-many relationships.
- Credential uploads with verification status.
- Public directory with filters and SEO profile pages.
- Publish/unpublish profile toggle.

## User stories
- As a therapist, I can create and publish a profile so clients can find me.
- As a therapist, I can list my modalities and issues treated.
- As a therapist, I can upload credentials for verification.
- As a client, I can browse and filter therapists by modality and location.

## Acceptance criteria
- Therapist can create, edit, publish, and unpublish a profile.
- Profile displays on mobile and includes at least one contact method.
- Directory filters by modality and city/online within 3 clicks.
- Profile pages are indexable and use SEO-friendly slugs.
- Credential uploads accept PDF/JPG/PNG only (<= 5MB).

## Technical requirements
- Add tables in `src/lib/schema.ts`:
  - therapistProfile, modality, therapistModality, issue, therapistIssue, credential
- Create profile builder UI in `src/components/therapist/profile-form/`.
- Public directory page at `src/app/(public)/directory/page.tsx`.
- Public profile page at `src/app/(public)/t/[slug]/page.tsx`.
- Upload handling via `src/lib/storage.ts` and upload API route.
- All user-facing labels in Hebrew (e.g., "שם תצוגה", "תחומי טיפול").

## Dependencies
- Epic 1 (auth, RBAC, phone verification).
- File storage abstraction (`src/lib/storage.ts`).

## Success metrics
- Number of published therapist profiles.
- Directory search-to-profile click-through rate.
- Percentage of profiles with verified credentials.
