import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendOtp } from "@/lib/phone-verification";
import { user } from "@/lib/schema";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone : "";

  if (!phone) {
    return NextResponse.json({ error: "INVALID_PHONE" }, { status: 400 });
  }

  try {
    const { phone: normalizedPhone, expiresAt } = await sendOtp(phone);

    await db
      .update(user)
      .set({ phone: normalizedPhone, phoneVerified: false })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({
      phone: normalizedPhone,
      expiresAt: expiresAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "INVALID_PHONE" }, { status: 400 });
  }
}
