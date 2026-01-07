import { redirect } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;
  if (!token) redirect("/sign-in?verified=0");

  redirect(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
}
