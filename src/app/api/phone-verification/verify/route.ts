import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  normalizeIsraeliPhone,
  verifyOtp,
} from "@/lib/phone-verification";
import { user } from "@/lib/schema";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!phone || !code) {
    return NextResponse.json({ error: "INVALID_OTP" }, { status: 400 });
  }

  const verified = await verifyOtp(phone, code);

  if (!verified) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  try {
    const normalizedPhone = normalizeIsraeliPhone(phone);

    await db
      .update(user)
      .set({ phone: normalizedPhone, phoneVerified: true })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ verified: true, phone: normalizedPhone });
  } catch {
    return NextResponse.json({ verified: false }, { status: 400 });
  }
}
