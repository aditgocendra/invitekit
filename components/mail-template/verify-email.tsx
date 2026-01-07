import { Html, Text, Button, render } from "@react-email/components";

export const renderVerifyEmailTemplate = async (props: {
  verifyUrl: string;
}) => {
  return await render(<VerifyEmailTemplate {...props} />);
};

const VerifyEmailTemplate = (props: { verifyUrl: string }) => {
  return (
    <Html lang='id'>
      <Text>Terima kasih sudah mendaftar.</Text>
      <Button href={props.verifyUrl}>Verifikasi email</Button>
      <Text>Jika kamu tidak merasa mendaftar, abaikan email ini.</Text>
    </Html>
  );
};
