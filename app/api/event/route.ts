import { auth } from "@/lib/auth";
import { deleteObject, getSignedUrlForUpload } from "@/lib/s3";
import {
  createInvitationEvent,
  deleteEventById,
  getEventById,
  getEventByUserId,
  updateEvent,
} from "@/services/invitation/event.services";
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright"; // atau puppeteer
import z from "zod";

const Primitive = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const SaveSchema = z.object({
  templateKey: z.string(),
  values: z.record(z.string(), Primitive),
});

const uploadImage = async (id: string) => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: {
      width: 900,
      height: 1600,
    },
  });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/preview?id=${id}&screenshot=true`;

  await page.goto(url, { waitUntil: "networkidle" });

  // ✅ Inject CSS untuk hilangkan max-width
  await page.addStyleTag({
    content: `
    * {
      max-width: none !important;
    }
    body, html {
      width: 900px !important;
      overflow: hidden !important;
    }
  `,
  });
  const png = await page.screenshot({
    type: "png",
    fullPage: false,
  }); // API screenshot Playwright [web:234]
  await browser.close();

  // ✅ Upload Buffer langsung ke S3
  const imageName = `${crypto.randomUUID()}.png`;
  const imagePath = `thumbnails/${id}/${imageName}`;

  // Dapatkan signed URL untuk upload (content-type harus "image/png")
  const signedUrl = await getSignedUrlForUpload(imagePath, "image/png");

  // ✅ Konversi Buffer ke Uint8Array (atau Blob) agar TS happy
  const buffer = Uint8Array.from(png);

  // Upload ke S3 menggunakan PUT
  await fetch(signedUrl, {
    method: "PUT",
    body: buffer, // ✅ Uint8Array adalah BodyInit yang valid
    headers: {
      "Content-Type": "image/png",
    },
  });

  return imagePath;
};

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const parsed = SaveSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const r = await createInvitationEvent({
      templateKey: body.templateKey,
      userId: session.user.id,
      configJson: body.values,
      type: "WEDDING",
    });

    const imagePath = await uploadImage(r.id);

    await updateEvent({
      id: r.id,
      thumb: imagePath,
    });

    return NextResponse.json({ data: r }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const body = await req.json();

  const parsed = SaveSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  // Update
  const imagePath = await uploadImage(eventId);

  // Hapus gambar lama
  const event = await getEventById(eventId);

  if (event?.thumb) {
    await deleteObject(event.thumb);
  }

  await updateEvent({ id: eventId, configJson: body.values, thumb: imagePath });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const event = await getEventById(eventId);

  if (event?.userId !== session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const r = await deleteEventById(eventId);

  if (r.thumb) await deleteObject(r.thumb);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await getEventByUserId(session.user.id);

  return NextResponse.json({ data }, { status: 200 });
}
