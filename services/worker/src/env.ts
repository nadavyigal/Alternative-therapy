import { z } from "zod";

const envSchema = z.object({
  REDIS_URL: z.string().default("redis://redis:6379"),
  WORKER_PORT: z.coerce.number().int().positive().default(4001),
  WORKER_QUEUE_NAME: z.string().default("therapistos-jobs"),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  WORKER_JOB_ATTEMPTS: z.coerce.number().int().positive().default(3),
  WORKER_JOB_BACKOFF_MS: z.coerce.number().int().positive().default(5000),
  WORKER_API_TOKEN: z.string().optional(),
  WORKER_LOG_LEVEL: z.string().default("info"),
});

export const env = envSchema.parse({
  REDIS_URL: process.env.REDIS_URL,
  WORKER_PORT: process.env.WORKER_PORT,
  WORKER_QUEUE_NAME: process.env.WORKER_QUEUE_NAME,
  WORKER_CONCURRENCY: process.env.WORKER_CONCURRENCY,
  WORKER_JOB_ATTEMPTS: process.env.WORKER_JOB_ATTEMPTS,
  WORKER_JOB_BACKOFF_MS: process.env.WORKER_JOB_BACKOFF_MS,
  WORKER_API_TOKEN: process.env.WORKER_API_TOKEN,
  WORKER_LOG_LEVEL: process.env.WORKER_LOG_LEVEL,
});
