import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import FieldInput from "../ui/field";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const SignInForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8 space-y-8'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Welcome back</h1>
              <p className='text-muted-foreground text-balance'>
                Sign In to your Invitekit account
              </p>
            </div>

            <FieldInput
              label='Email'
              type='email'
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
                placeholder='**********'
                required
              />
            </div>

            <Button
              type='submit'
              className='w-full'>
              Sign In
            </Button>

            <div className='relative'>
              <Separator />
              <p className='absolute -top-4 left-1/2 -translate-x-1/2 p-1.5 bg-card text-sm text-nowrap text-muted-foreground'>
                Or continue with
              </p>
            </div>

            <Button
              variant='outline'
              type='button'
              className='w-full'>
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

export const SignUpForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8 space-y-8'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Create Account</h1>
              <p className='text-muted-foreground text-balance text-sm'>
                Enter your email below to create your account
              </p>
            </div>

            <FieldInput
              label='Email'
              type='email'
              placeholder='examples@gmail.com'
              required
            />

            <div className='flex gap-2 items-center'>
              <FieldInput
                label='Password'
                type='password'
                placeholder='**********'
                required
              />
              <FieldInput
                label='Confirm Password'
                type='confirmPassword'
                placeholder='**********'
                required
              />
            </div>

            <Button
              type='submit'
              className='w-full'>
              Sign Up
            </Button>

            <div className='relative'>
              <Separator />
              <p className='absolute -top-4 left-1/2 -translate-x-1/2 p-1.5 bg-card text-sm text-nowrap text-muted-foreground'>
                Or continue with
              </p>
            </div>

            <Button
              variant='outline'
              type='button'
              className='w-full'>
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

export const ForgotPasswordForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6 md:p-8 space-y-8'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <h1 className='text-2xl font-bold'>Forgot Password</h1>
              <p className='text-muted-foreground text-balance'>
                Reset password for your Invitekit account
              </p>
            </div>

            <FieldInput
              label='Email'
              type='email'
              placeholder='examples@gmail.com'
              required
            />

            <Button
              type='submit'
              className='w-full'>
              Reset Password
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
