"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import FieldInput from "../ui/field";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  ForgotPasswordFormSchema,
  ResetPasswordFormSchema,
  SignInFormSchema,
  SignUpFormSchema,
} from "@/validation/user.validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "../alert";

type SignInInput = z.infer<typeof SignInFormSchema>;

export const SignInForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInFormSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") ?? "/dashboard",
    [searchParams]
  );

  const onSubmit = async (data: SignInInput) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl,
    });

    if (!res) {
      setError("No response from server.");
      return;
    }

    if (res.error) {
      setError("Email atau password salah.");
      return;
    }

    router.push(res.url ?? callbackUrl);
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            className='p-6 md:p-8 space-y-8'
            onSubmit={form.handleSubmit((data) => onSubmit(data))}>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Welcome back</h1>
              <p className='text-muted-foreground text-balance'>
                Sign In to your Invitekit account
              </p>
            </div>

            <FieldInput
              label='Email'
              type='email'
              {...form.register("email")}
              placeholder='examples@gmail.com'
              required
            />

            <div>
              <div className='flex items-center mb-1.5'>
                <Label
                  htmlFor='password'
                  className='text-sm text-muted-foreground font-semibold '>
                  Password
                </Label>
                <Link
                  href='/forgot-password'
                  className='ml-auto text-sm underline-offset-4 hover:underline'>
                  Forgot your password?
                </Link>
              </div>
              <Input
                id='password'
                type='password'
                {...form.register("password")}
                placeholder='**********'
                required
              />
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={form.formState.isSubmitting}>
              Sign In
            </Button>

            {error && (
              <div className='rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700'>
                {error}
              </div>
            )}

            <div className='relative'>
              <Separator />
              <p className='absolute -top-4 left-1/2 -translate-x-1/2 p-1.5 bg-card text-sm text-nowrap text-muted-foreground'>
                Or continue with
              </p>
            </div>

            <Button
              variant='outline'
              type='button'
              className='w-full'
              onClick={() => signIn("google", { callbackUrl })}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'>
                <path
                  d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                  fill='currentColor'
                />
              </svg>
              <span>Login with Google</span>
            </Button>

            <p className='text-center text-sm text-muted-foreground text-balance'>
              Don&apos;t have an account?{" "}
              <Link
                href='/sign-up'
                className='font-semibold text-primary'>
                Sign up
              </Link>
            </p>
          </form>

          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/assets/art-sign.webp'
              alt='Image'
              width={900}
              height={1600}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type SignUpInput = z.infer<typeof SignUpFormSchema>;
export const SignUpForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [successMessage, setSuccessMessage] = useState<string | null>();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const onSubmitHandler = async (data: SignUpInput) => {
    const r = await fetch("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (r.ok) {
      setSuccessMessage(
        "Account successfully created, please open your email to verification and sign in"
      );
    } else {
      const error = await r.json();
      form.setError("formError", { message: error.message });
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            className='p-6 md:p-8 space-y-6'
            onSubmit={form.handleSubmit(onSubmitHandler)}>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Create Account</h1>
              <p className='text-muted-foreground text-balance text-sm'>
                Enter your email below to create your account
              </p>
            </div>

            <FieldInput
              label='Fullname'
              type='name'
              {...form.register("name")}
              placeholder='Your name'
              errorMessage={form.formState.errors.name?.message}
            />

            <FieldInput
              label='Email'
              type='email'
              {...form.register("email")}
              placeholder='examples@gmail.com'
              errorMessage={form.formState.errors.email?.message}
            />

            <div className='flex gap-2 items-center'>
              <FieldInput
                label='Password'
                type='password'
                {...form.register("password")}
                placeholder='**********'
                errorMessage={form.formState.errors.password?.message}
              />
              <FieldInput
                label='Confirm Password'
                type='password'
                {...form.register("confirmPassword")}
                placeholder='**********'
                errorMessage={form.formState.errors.confirmPassword?.message}
              />
            </div>

            {form.formState.errors.formError && (
              <Alert
                type='error'
                title='Error'
                message={form.formState.errors.formError.message!}
              />
            )}

            {successMessage && (
              <Alert
                type='success'
                title='Account Created'
                message={successMessage}
              />
            )}

            <Button
              type='submit'
              className='w-full'>
              Sign Up
            </Button>

            <p className='text-center text-sm text-muted-foreground text-balance'>
              Already have an account?{" "}
              <Link
                href='/sign-in'
                className='font-semibold text-primary'>
                Sign in
              </Link>
            </p>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/assets/art-s.webp'
              alt='Image'
              width={900}
              height={1600}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type ForgotPasswordInput = z.infer<typeof ForgotPasswordFormSchema>;
export const ForgotPasswordForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [message, setMessage] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  const onSubmitHandler = async (data: ForgotPasswordInput) => {
    const r = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (r.ok) {
      setMessage({
        type: "success",
        message: "We have sent you an email, Please check your email",
      });
    } else {
      const error = await r.json();
      setMessage({ type: "error", message: error.message });
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className='p-6 md:p-8 space-y-8'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Forgot Password</h1>
              <p className='text-muted-foreground text-balance'>
                Forgot password for your Invitekit account
              </p>
            </div>

            <FieldInput
              label='Email'
              type='email'
              {...form.register("email")}
              placeholder='examples@gmail.com'
              errorMessage={form.formState.errors.email?.message}
            />

            <Button
              type='submit'
              className='w-full'>
              Reset Password
            </Button>

            {message && (
              <Alert
                type={message.type as "success" | "error"}
                title={message.type === "success" ? "Success" : "Error"}
                message={message.message}
              />
            )}

            <p className='text-center text-sm text-muted-foreground text-balance'>
              Don&apos;t have an account?{" "}
              <Link
                href='/sign-up'
                className='font-semibold text-primary'>
                Sign up
              </Link>
            </p>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/placeholder.svg'
              alt='Image'
              width={0}
              height={0}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type ResetPasswordInput = z.infer<typeof ResetPasswordFormSchema>;

interface ResetPasswordFormProps extends React.ComponentProps<"div"> {
  token: string;
}
export const ResetPasswordForm = ({
  token,
  className,
  ...props
}: ResetPasswordFormProps) => {
  const [message, setMessage] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const onSubmitHandler = async (data: ResetPasswordInput) => {
    const body = JSON.stringify({
      token: token,
      newPassword: data.password,
    });

    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      body,
    });

    if (r.ok) {
      setCountdown(3);
      setMessage({
        type: "success",
        message: "",
      });
    } else {
      const error = await r.json();
      setMessage({ type: "error", message: error.message });
    }
  };

  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className='p-6 md:p-8 space-y-8'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Reset Password</h1>
              <p className='text-muted-foreground text-balance'>
                Reset password for your Invitekit account
              </p>
            </div>

            <FieldInput
              label='New Password'
              type='password'
              {...form.register("password")}
              placeholder='**********'
              errorMessage={form.formState.errors.password?.message}
            />
            <FieldInput
              label='Confirm Password'
              type='password'
              {...form.register("confirmPassword")}
              placeholder='**********'
              errorMessage={form.formState.errors.confirmPassword?.message}
            />

            <Button
              type='submit'
              className='w-full'>
              Confirm
            </Button>

            {message && (
              <Alert
                type={message.type as "success" | "error"}
                title={message.type === "success" ? "Success" : "Error"}
                message={
                  message.type === "success"
                    ? `Reset password successfully, you redirected to sign in in ${countdown} seconds`
                    : message.message
                }
              />
            )}

            {/* <p className='text-center text-sm text-muted-foreground text-balance'>
              Don&apos;t have an account?{" "}
              <Link
                href='/sign-up'
                className='font-semibold text-primary'>
                Sign up
              </Link>
            </p> */}
          </form>
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/placeholder.svg'
              alt='Image'
              width={0}
              height={0}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
