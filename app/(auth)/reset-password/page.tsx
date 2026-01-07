import { ResetPasswordForm } from "@/components/form/form-auth";
import { notFound } from "next/navigation";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) return notFound();

  return <ResetPasswordForm token={token} />;
}
