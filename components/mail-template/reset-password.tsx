import * as React from "react";
import { Html, Text, Button, render } from "@react-email/components";

export const renderResetPasswordTemplate = async (props: {
  resetUrl: string;
}) => {
  return await render(<ResetPassword {...props} />);
};

const ResetPassword = (props: { resetUrl: string }) => {
  return (
    <Html lang='id'>
      <Text>Klik tombol berikut untuk reset password.</Text>
      <Button href={props.resetUrl}>Reset password</Button>
      <Text>Jika bukan kamu, abaikan email ini.</Text>
    </Html>
  );
};
