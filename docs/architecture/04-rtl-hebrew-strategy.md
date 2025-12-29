# RTL / Hebrew Strategy

## Overview
TherapistOS is Hebrew-first and RTL by default. All layouts, components, and UI text must respect right-to-left direction and Hebrew typography.

## Core rules
- Set `dir="rtl"` and `lang="he"` at the root layout (`src/app/layout.tsx`).
- Use the Heebo font for all Hebrew UI text (configured in `src/app/layout.tsx`).
- Use Tailwind logical properties only (ps/pe/ms/me) instead of left/right.
- Use `text-start`, `items-start`, `justify-start` for RTL-aware alignment.

## Example
```tsx
// ✅ Correct RTL
<div className="ps-4 pe-2 ms-auto text-start" dir="rtl">
  <button className="me-2">שמור</button>
</div>

// ❌ Incorrect (breaks RTL)
<div className="pl-4 pr-2 ml-auto text-left">
  <button className="mr-2">Save</button>
</div>
```

## Hebrew UI text
All user-facing strings must be Hebrew:
- Auth: "התחבר", "הרשמה"
- Forms: "שם מלא", "טלפון", "שליחה"
- Errors: "שגיאה, נסו שוב"

Technical documentation and code comments remain in English.

## Components to audit
- `src/app/layout.tsx`
- `src/app/(public)/*`
- `src/app/(therapist)/*`
- `src/components/*`
