import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getServerEnv } from "./env";

// Use validated environment with fallbacks
const env = getServerEnv();
const rawConnectionString = process.env.POSTGRES_URL;

if (env.NODE_ENV === "production" && !rawConnectionString) {
  throw new Error("POSTGRES_URL environment variable is required in production");
}

const connectionString = rawConnectionString || env.POSTGRES_URL;

const globalForPostgres = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
};

const client =
  globalForPostgres.postgresClient ??
  postgres(connectionString, {
    max: env.NODE_ENV === "production" ? 1 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

if (env.NODE_ENV !== "production") {
  globalForPostgres.postgresClient = client;
}

export const db = drizzle(client, { schema });
