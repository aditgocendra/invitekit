import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { verifyResetToken } from "@/lib/token";
import { updateUser } from "@/services/user/user.services";
import {
  getActionToken,
  updateActionToken,
} from "@/services/user/action-token.services";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const payload = await verifyResetToken(token);
  if (payload.type !== "reset-password" || !payload.email || !payload.jti) {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  const row = await getActionToken(payload.jti);

  if (!row || row.type !== "reset-password" || row.email !== payload.email) {
    return NextResponse.json({ message: "Token invalid" }, { status: 400 });
  }

  if (row.usedAt) {
    return NextResponse.json(
      { message: "Token already used" },
      { status: 400 }
    );
  }

  if (row.expiresAt < new Date()) {
    return NextResponse.json({ message: "Token expired" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await updateUser({ email: payload.email, password: passwordHash });

  await updateActionToken(payload.jti);

  return NextResponse.json({ ok: true });
}
