import { setTimeout as sleep } from "timers/promises";
import type { Job } from "bullmq";

type JobHandler = (payload: Record<string, unknown>, job: Job) => Promise<unknown>;

const handlers: Record<string, JobHandler> = {
  "email.send": async (payload, job) => {
    await job.log("Dispatching email notification.");
    await sleep(250);
    return { delivered: true, payload };
  },
  "reminder.send": async (payload, job) => {
    await job.log("Sending appointment reminder.");
    await sleep(200);
    return { delivered: true, payload };
  },
  "ai.match": async (payload, job) => {
    await job.log("Running AI matching workflow.");
    await sleep(400);
    return { matched: true, payload };
  },
  "integration.invoice": async (payload, job) => {
    await job.log("Calling invoicing provider.");
    await sleep(300);
    return { queued: true, payload };
  },
};

export const jobTypes = Object.keys(handlers);

export async function handleJob(job: Job): Promise<unknown> {
  const handler = handlers[job.name];

  if (!handler) {
    throw new Error(`Unsupported job type: ${job.name}`);
  }

  return handler(job.data as Record<string, unknown>, job);
}
