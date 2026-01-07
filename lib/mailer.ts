import { SendSmtpEmail, TransactionalEmailsApi } from "@getbrevo/brevo";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const apiInstance = new TransactionalEmailsApi();

    const auth = (
      apiInstance as unknown as {
        authentications: { apiKey: { apiKey: string } };
      }
    ).authentications;
    auth.apiKey.apiKey = process.env.BREVO_API_KEY!;

    const emailData: SendSmtpEmail = {
      sender: {
        email: process.env.BREVO_SENDER!,
        name: "Invitekit",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const result = await apiInstance.sendTransacEmail(emailData);
    return result.response;
  } catch {
    throw new Error("Failed to send email");
  }
};
