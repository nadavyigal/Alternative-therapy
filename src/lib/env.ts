import { z } from "zod";

/**
 * Server-side environment variables schema.
 * These variables are only available on the server.
 */
const serverEnvSchema = z.object({
  // Database - use fallback for development UI preview
  POSTGRES_URL: z.string().url("Invalid database URL").default("postgresql://localhost:5432/therapistos_dev"),

  // Authentication - use fallback for development UI preview
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters")
    .default("dev-secret-key-for-ui-preview-only-change-in-production"),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),

  // AI
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default("openai/gpt-4o-mini"),

  // Storage
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Client-side environment variables schema.
 * These variables are exposed to the browser via NEXT_PUBLIC_ prefix.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validates and returns server-side environment variables.
 * Throws an error if validation fails.
 */
export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid server environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}

/**
 * Validates and returns client-side environment variables.
 * Throws an error if validation fails.
 */
export function getClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error(
      "Invalid client environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
}

/**
 * Checks if required environment variables are set.
 * Logs warnings for missing optional variables.
 */
export function checkEnv(): void {
  const warnings: string[] = [];

  // In development, allow fallback values
  const isDev = process.env.NODE_ENV === "development";

  // Check required variables
  if (!process.env.POSTGRES_URL && !isDev) {
    throw new Error("POSTGRES_URL is required");
  } else if (!process.env.POSTGRES_URL && isDev) {
    warnings.push("POSTGRES_URL not set. Using fallback (database features will not work).");
  }

  if (!process.env.BETTER_AUTH_SECRET && !isDev) {
    throw new Error("BETTER_AUTH_SECRET is required");
  } else if (!process.env.BETTER_AUTH_SECRET && isDev) {
    warnings.push("BETTER_AUTH_SECRET not set. Using fallback (authentication will not work).");
  }

  // Check optional variables and warn
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    warnings.push("Google OAuth is not configured. Google login will be disabled.");
  }

  if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
    warnings.push("Facebook OAuth is not configured. Facebook login will be disabled.");
  }

  if (!process.env.OPENROUTER_API_KEY) {
    warnings.push("OPENROUTER_API_KEY is not set. AI chat will not work.");
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    warnings.push("BLOB_READ_WRITE_TOKEN is not set. Using local storage for file uploads.");
  }

  // Log warnings in development
  if (isDev && warnings.length > 0) {
    console.warn("\n⚠️  Environment warnings (UI preview mode):");
    warnings.forEach((w) => console.warn(`   - ${w}`));
    console.warn("\n   💡 Create .env.local file to enable full functionality.\n");
  }
}
