# TherapistOS

Hebrew-first, RTL-optimized two-sided marketplace for alternative therapists in Israel.

Local UI: http://localhost:3000

## Quick start

```bash
pnpm install
cp env.example .env
pnpm dev
```

If you need the full stack (database + auth):

```bash
docker compose up -d
pnpm db:migrate
pnpm dev
```

## Docs

- Product requirements: `docs/prd.md`
- Architecture: `docs/architecture.md`
- Readiness checklist: `docs/READY.md`
- Story files: `docs/stories/`

## Boilerplate

The original Agentic Coding Boilerplate has been moved under `boilerplate/`:

- `boilerplate/README-agentic-coding-boilerplate.md`
- `boilerplate/create-agentic-app/`
