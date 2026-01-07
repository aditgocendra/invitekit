import { Alert } from "@/components/alert";
import { SignInForm } from "@/components/form/form-auth";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const { verified } = await searchParams;
  return (
    <div className='space-y-4'>
      {verified && (
        <Alert
          type={verified === "1" ? "success" : "error"}
          title='Email Verification'
          message={
            verified === "1"
              ? "Email successfully verified, please sign in"
              : "Sorry, your email verification failed"
          }
        />
      )}
      <SignInForm />
    </div>
  );
}
