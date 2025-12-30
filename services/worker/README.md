# Background Worker Service

Purpose: async jobs, scheduled tasks, and integration isolation (email, AI, invoicing).

## Endpoints

- `GET /health` - service + queue status
- `GET /jobs/types` - supported job types
- `POST /jobs/:type` - enqueue a job

### Example

```bash
curl -X POST http://localhost:4001/jobs/email.send \
  -H "Content-Type: application/json" \
  -H "X-Worker-Token: $WORKER_API_TOKEN" \
  -d '{"payload":{"to":"client@example.com","templateId":"lead-notification"}}'
```

### Scheduling

```bash
curl -X POST http://localhost:4001/jobs/reminder.send \
  -H "Content-Type: application/json" \
  -d '{"payload":{"bookingId":"123"},"schedule":{"runAt":"2025-01-12T08:00:00Z"}}'
```

## Env vars

- `REDIS_URL`
- `WORKER_PORT`
- `WORKER_QUEUE_NAME`
- `WORKER_CONCURRENCY`
- `WORKER_JOB_ATTEMPTS`
- `WORKER_JOB_BACKOFF_MS`
- `WORKER_API_TOKEN`
- `WORKER_LOG_LEVEL`
