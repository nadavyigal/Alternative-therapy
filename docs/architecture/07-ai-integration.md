# AI Integration (OpenRouter)

## Overview
TherapistOS uses the Vercel AI SDK with OpenRouter to draft Hebrew messages for therapists. Drafts are always editable before sending.

## Implementation files
- `src/app/api/ai/message-draft/route.ts` - Server route for generation
- `src/lib/env.ts` - Environment variables

## Environment variables
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (default: `openai/gpt-4o-mini`)

## Example implementation
```ts
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

const { text } = await generateText({
  model: openrouter(process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini"),
  system: "אתה עוזר לכתיבת הודעות בעברית למטפלים. אין לתת ייעוץ רפואי.",
  prompt: "צור הודעת תזכורת לפגישה מחר בשעה 10:00.",
});
```

## Constraints
- Do not generate medical advice.
- Do not include or request sensitive health information.
- Always allow the therapist to edit before sending.

## Suggested intents
- lead_reply
- booking_confirmation
- reschedule
- reminder

## Credential extraction
When a credential document is uploaded, extract title, issuer, and issued year with a confidence score. Store extracted values in the credential record and allow therapists to edit before verification.
