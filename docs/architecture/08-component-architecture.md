# Component Architecture

## Overview
UI is built with Next.js App Router and shadcn/ui. Components are organized by domain and reuse shared UI primitives.

## Source structure
- `src/app/` - Routes, layouts, and server components
  - `(public)` - Directory and public profiles
  - `(auth)` - Login/signup/onboarding
  - `(therapist)` - Therapist dashboard and tools
  - `(admin)` - Admin tools
  - `api/` - Route handlers
- `src/components/ui/` - shadcn/ui primitives
- `src/components/auth/` - Auth UI
- `src/components/therapist/` - Therapist domain components
- `src/components/directory/` - Public directory components
- `src/components/admin/` - Admin components

## Component guidelines
- Server components by default; add `"use client"` only when needed.
- Keep file names kebab-case and component names PascalCase.
- Use Tailwind logical properties for RTL (`ps-`, `pe-`, `ms-`, `me-`).
- Keep user-facing strings in Hebrew.

## Patterns
- Page components fetch data server-side and pass to UI components.
- Form state and interactivity live in client components.
- Shared logic should live in `src/lib/` or `src/hooks/`.

## Examples
- Therapist profile form: `src/components/therapist/profile-form/`
- Lead inbox: `src/components/therapist/lead-inbox/`
- Directory filters: `src/components/directory/filters.tsx`
