export interface WhatsAppPayload {
  target: string | string[]; // nomor tujuan
  message: string; // isi pesan
}

export interface WhatsAppResponse {
  status: boolean;
  message: string;
  processing: number;
}

export async function sendWhatsApp({
  target,
  message,
}: WhatsAppPayload): Promise<WhatsAppResponse> {
  const token = process.env.FONNTE_DEVICE_TOKEN;
  if (!token) {
    throw new Error("FONNTE_TOKEN is not set in environment variables");
  }

  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target,
      message,
    }),
  });

  const json = await res.json();

  return json as WhatsAppResponse;
}
