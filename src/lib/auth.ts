import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import {
  sendPasswordResetEmail as sendPasswordResetEmailMessage,
  sendVerificationEmail as sendVerificationEmailMessage,
} from "./email"
import { db } from "./db"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const facebookClientId = process.env.FACEBOOK_CLIENT_ID
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      phoneVerified: {
        type: "boolean",
        required: false,
      },
      locale: {
        type: "string",
        required: false,
      },
    },
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            mapProfileToUser: () => ({ role: "therapist" }),
          },
        }
      : {}),
    ...(facebookClientId && facebookClientSecret
      ? {
          facebook: {
            clientId: facebookClientId,
            clientSecret: facebookClientSecret,
            mapProfileToUser: () => ({ role: "therapist" }),
          },
        }
      : {}),
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      const result = await sendPasswordResetEmailMessage({
        to: user.email,
        name: user.name,
        url,
      })

      if (result.skipped && process.env.NODE_ENV !== "production") {
        console.warn(`Password reset URL for ${user.email}: ${url}`)
        return
      }

      if (!result.ok) {
        console.warn(
          `[auth] Failed to send password reset email to ${user.email}: ${
            result.error || "unknown error"
          }`
        )
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const result = await sendVerificationEmailMessage({
        to: user.email,
        name: user.name,
        url,
      })

      if (result.skipped && process.env.NODE_ENV !== "production") {
        console.warn(`Email verification URL for ${user.email}: ${url}`)
        return
      }

      if (!result.ok) {
        console.warn(
          `[auth] Failed to send verification email to ${user.email}: ${
            result.error || "unknown error"
          }`
        )
      }
    },
  },
})
