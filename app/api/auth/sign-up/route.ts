import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignUpFormSchema } from "@/validation/user.validation";
import { createUser, userIsExist } from "@/services/user/user.services";
import { signVerifyEmailToken } from "@/lib/token";
import { sendEmail } from "@/lib/mailer";
import { renderVerifyEmailTemplate } from "@/components/mail-template/verify-email";
import { createActionToken } from "@/services/user/action-token.services";

const schema = SignUpFormSchema;

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const { name, email, password } = parsed.data;

    const exists = await userIsExist(email);
    if (exists) {
      return NextResponse.json(
        { message: "Email already used" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      name,
      email,
      password: passwordHash,
    });

    const jti = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await createActionToken({
      jti,
      email,
      type: "verify-email",
      expiresAt,
    });

    const token = await signVerifyEmailToken({
      type: "verify-email",
      email,
      jti,
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${encodeURIComponent(token)}`;
    const emailTemplate = await renderVerifyEmailTemplate({ verifyUrl });

    await sendEmail({
      to: email,
      subject: "Verifikasi email",
      html: emailTemplate,
    });

    return NextResponse.json(user, { status: 201 });
    // return NextResponse.json({ ok: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
