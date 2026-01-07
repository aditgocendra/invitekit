import { NextResponse } from "next/server";

import { verifyEmailToken } from "@/lib/token";
import { updateUser } from "@/services/user/user.services";
import {
  getActionToken,
  updateActionToken,
} from "@/services/user/action-token.services";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token)
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });

  const payload = await verifyEmailToken(token);
  if (payload.type !== "verify-email" || !payload.email || !payload.jti) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const row = await getActionToken(payload.jti);

  if (!row || row.type !== "verify-email" || row.email !== payload.email) {
    return NextResponse.json({ error: "Token invalid" }, { status: 400 });
  }

  if (row.usedAt) {
    return NextResponse.json({ error: "Token already used" }, { status: 400 });
  }

  if (row.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  await updateUser({ email: payload.email, emailVerified: new Date() });

  await updateActionToken(payload.jti);

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?verified=1`
  );
}
