import z from "zod";

export const SignInFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const SignUpFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    formError: z.string().optional(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["formError"],
        message: "Passwords do not match",
      });
    }
  });

export const ForgotPasswordFormSchema = z.object({ email: z.email() });

export const ResetPasswordFormSchema = z
  .object({ password: z.string().min(8), confirmPassword: z.string().min(8) })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["formError"],
        message: "Passwords do not match",
      });
    }
  });
