import { CredentialsSignin } from "next-auth";

export class WrongPasswordError extends CredentialsSignin {
  code = "wrong_password";
}

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}
