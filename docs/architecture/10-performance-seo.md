# Performance & SEO

## Overview
Public therapist profiles and directory pages must be fast and indexable. The platform is mobile-first with Hebrew SEO considerations.

## SEO requirements
- SEO-friendly profile slugs: `/t/[slug]`.
- Use `generateMetadata` for title/description and OpenGraph data.
- Include canonical URLs and structured data where appropriate.
- Ensure public pages are crawlable (no auth gating).

## Performance practices
- Server-render public profiles for fast first load.
- Use `next/image` for profile images and optimize sizes.
- Use caching or revalidation for directory queries.
- Avoid heavy client bundles in public routes.

## Implementation files
- `src/app/(public)/directory/page.tsx`
- `src/app/(public)/t/[slug]/page.tsx`
- `src/app/layout.tsx`
- `next.config.ts`

## Analytics hooks
Track SEO and conversion events:
- profile_published
- lead_created
- booking_created
