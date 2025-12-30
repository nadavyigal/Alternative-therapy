import Fastify from "fastify";
import IORedis from "ioredis";
import { Queue, QueueScheduler, Worker } from "bullmq";
import type { JobsOptions } from "bullmq";
import { z } from "zod";
import { env } from "./env.js";
import { handleJob, jobTypes } from "./jobs.js";

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
const queue = new Queue(env.WORKER_QUEUE_NAME, { connection });
const scheduler = new QueueScheduler(env.WORKER_QUEUE_NAME, { connection });

const worker = new Worker(env.WORKER_QUEUE_NAME, handleJob, {
  connection,
  concurrency: env.WORKER_CONCURRENCY,
});

worker.on("completed", (job) => {
  job.log("Job completed.").catch(() => undefined);
});

worker.on("failed", (job, err) => {
  if (job) {
    job.log(`Job failed: ${err.message}`).catch(() => undefined);
  }
});

const app = Fastify({
  logger: { level: env.WORKER_LOG_LEVEL },
});

const jobRequestSchema = z.object({
  payload: z.record(z.any()).default({}),
  schedule: z
    .object({
      delayMs: z.number().int().nonnegative().optional(),
      runAt: z.string().datetime().optional(),
    })
    .optional(),
  options: z
    .object({
      attempts: z.number().int().positive().optional(),
      backoffMs: z.number().int().positive().optional(),
      priority: z.number().int().optional(),
    })
    .optional(),
});

app.get("/health", async () => {
  const counts = await queue.getJobCounts("waiting", "active", "delayed", "failed");
  return {
    status: "ok",
    queue: env.WORKER_QUEUE_NAME,
    counts,
  };
});

app.get("/jobs/types", async () => ({
  types: jobTypes,
}));

app.post<{ Params: { type: string } }>("/jobs/:type", async (request, reply) => {
  if (env.WORKER_API_TOKEN) {
    const token = request.headers["x-worker-token"];
    if (token !== env.WORKER_API_TOKEN) {
      reply.code(401);
      return { error: "Unauthorized" };
    }
  }

  const parsed = jobRequestSchema.safeParse(request.body ?? {});
  if (!parsed.success) {
    reply.code(400);
    return { error: "Invalid request", details: parsed.error.flatten() };
  }

  const { type } = request.params;
  if (!jobTypes.includes(type)) {
    reply.code(400);
    return { error: "Unsupported job type", supported: jobTypes };
  }
  const { payload, schedule, options } = parsed.data;
  const jobOptions: JobsOptions = {
    attempts: options?.attempts ?? env.WORKER_JOB_ATTEMPTS,
    backoff: {
      type: "exponential" as const,
      delay: options?.backoffMs ?? env.WORKER_JOB_BACKOFF_MS,
    },
    priority: options?.priority,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  };

  if (schedule?.delayMs !== undefined) {
    jobOptions.delay = schedule.delayMs;
  } else if (schedule?.runAt) {
    const runAt = Date.parse(schedule.runAt);
    if (Number.isNaN(runAt)) {
      reply.code(400);
      return { error: "Invalid schedule.runAt" };
    }
    jobOptions.delay = Math.max(0, runAt - Date.now());
  }

  const job = await queue.add(type, payload, jobOptions);

  return {
    jobId: job.id,
    queued: true,
  };
});

async function shutdown(signal: string) {
  app.log.info({ signal }, "Shutting down worker service.");
  await app.close();
  await worker.close();
  await scheduler.close();
  await queue.close();
  await connection.quit();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

app.listen({ port: env.WORKER_PORT, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err, "Failed to start worker server.");
  process.exit(1);
});
