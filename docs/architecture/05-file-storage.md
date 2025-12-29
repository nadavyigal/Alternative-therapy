# File Storage & Uploads

## Overview
TherapistOS supports secure uploads for credentials and profile images. Production uses Vercel Blob; development uses local storage under `public/uploads/` via `src/lib/storage.ts`.

## Security constraints
- Allowed types: PDF, JPG, PNG.
- Max size: 5MB.
- Validate MIME type, file extension, and magic bytes.

## Implementation files
- `src/lib/storage.ts` - Storage abstraction
- `src/app/api/uploads/credential/route.ts` - Upload route (therapist only)
- `public/uploads/` - Local dev storage

## Validation helper (reference)
```ts
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;

const MAGIC_BYTES: Record<string, number[]> = {
  "application/pdf": [0x25, 0x50, 0x44, 0x46],
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
};

export function validateUpload(file: File, buffer: Uint8Array) {
  if (file.size > MAX_BYTES) throw new Error("FILE_TOO_LARGE");
  if (!ALLOWED_MIME_TYPES.includes(file.type)) throw new Error("INVALID_TYPE");
  // Validate magic bytes before upload
}
```

## Storage abstraction
`src/lib/storage.ts` should expose a consistent interface:
- `upload(buffer, filename, folder)`
- `deleteFile(url)`

Uploads must be tied to an authenticated therapist and recorded in the `credential` table.
