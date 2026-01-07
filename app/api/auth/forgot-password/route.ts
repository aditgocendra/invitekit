import { NextResponse } from "next/server";
import crypto from "crypto";
import { signResetPasswordToken } from "@/lib/token";
import { sendEmail } from "@/lib/mailer";
import { renderResetPasswordTemplate } from "@/components/mail-template/reset-password";
import { userIsExist } from "@/services/user/user.services";
import { createActionToken } from "@/services/user/action-token.services";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ ok: true });

  const user = await userIsExist(email);
  if (!user) return NextResponse.json({ ok: true }); // cegah enumeration

  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await createActionToken({
    jti,
    email,
    type: "reset-password",
    expiresAt,
  });

  const token = await signResetPasswordToken({
    type: "reset-password",
    email,
    jti,
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const emailTemplate = await renderResetPasswordTemplate({ resetUrl });
  await sendEmail({
    to: email,
    subject: "Reset password",
    html: emailTemplate,
  });

  return NextResponse.json({ ok: true });
}
