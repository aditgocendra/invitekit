import { auth } from "@/lib/auth";
import { deleteObject, getSignedUrlForUpload } from "@/lib/s3";
import {
  createInvitationEvent,
  deleteEventById,
  getEventById,
  getEventByUserId,
  updateEvent,
} from "@/services/invitation/event.services";
import { deleteInvitationsByIds } from "@/services/invitation/invitation.services";
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumExecutable from "@sparticuz/chromium"; // or puppeteer
import z from "zod";
import { nanoid } from "nanoid";
import { MultipleImageSchema } from "@/validation/image.validation";

const Primitive = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.object(),
  z.array(z.string()),
]);

const SaveSchema = z.object({
  templateKey: z.string(),
  values: z.record(z.string(), Primitive),
});

const createThumbnail = async (id: string) => {
  const isVercel = !!process.env.VERCEL;

  const launchOptions = isVercel
    ? {
        args: chromiumExecutable.args,
        executablePath: await chromiumExecutable.executablePath(),
        headless: true,
      }
    : {};

  const browser = await chromium.launch({
    ...launchOptions,
  });

  const page = await browser.newPage({
    viewport: {
      width: 900,
      height: 1600,
    },
  });

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/preview?id=${id}&screenshot=true`;

  await page.goto(url, { waitUntil: "networkidle" });

  // ✅ Inject CSS to remove max-width constraints
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
  });
  await browser.close();

  // ✅ Convert Buffer to Uint8Array (or Blob) to satisfy TypeScript
  const buffer = Uint8Array.from(png);

  return buffer;
};

const uploadImage = async ({
  file,
  specPath,
}: {
  file: Uint8Array<ArrayBuffer> | File;
  specPath: string;
}) => {
  // ✅ Upload Buffer directly to S3
  const imageName = `${crypto.randomUUID()}.png`;
  const imagePath = `${specPath}/${imageName}`;

  // Get signed URL for upload (content-type must be "image/png")
  const signedUrl = await getSignedUrlForUpload(imagePath, "image/png");

  // Upload to S3 using PUT
  await fetch(signedUrl, {
    method: "PUT",
    body: file, // ✅ Uint8Array is a valid BodyInit
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

  // Parse FormData
  const formData = await req.formData();

  // Extract images
  const images = formData.getAll("images") as File[];

  // Extract and parse values JSON
  const values = JSON.parse(formData.get("values") as string);
  const templateKey = formData.get("templateKey") as string;

  // Validate with Zod
  const parsed = SaveSchema.safeParse({ templateKey, values });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  // Validate images

  if (images.length > 0) {
    const parsedImages = MultipleImageSchema.safeParse(images);

    if (!parsedImages.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
  }

  try {
    const r = await createInvitationEvent({
      templateKey: templateKey,
      userId: session.user.id,
      configJson: values,
      type: "WEDDING",
      slug: nanoid(6),
    });

    // Create & upload thumbnail
    const thumbImage = await createThumbnail(r.id);
    const imagePath = await uploadImage({
      file: thumbImage,
      specPath: `thumbnails/${r.id}`,
    });

    // Upload gallery images
    let enrichedValues = values;
    if (images.length > 0) {
      const imagePaths = await Promise.all(
        images.map(async (image) => {
          const imagePath = await uploadImage({
            file: image,
            specPath: `gallery/${r.id}`,
          });
          return imagePath;
        }),
      );

      enrichedValues = {
        ...values,
        gallery: imagePaths,
      };
    }

    // Update event data
    await updateEvent({
      id: r.id,
      thumb: imagePath,
      configJson: enrichedValues,
    });

    return NextResponse.json({ data: r }, { status: 200 });
  } catch (e: unknown) {
    console.log((e as Error).message);
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

  // Parse FormData
  const formData = await req.formData();

  // Extract images with validation
  const imageFiles = formData.getAll("images");
  const imageUpload = imageFiles.filter(
    (file): file is File => file instanceof File,
  );

  const deletedFiles = formData.getAll("imageDeleted");
  const imageDeleted = deletedFiles.filter(
    (path): path is string => typeof path === "string",
  );

  // Extract and parse values JSON
  const valuesString = formData.get("values");
  const templateKey = formData.get("templateKey");

  if (!valuesString || !templateKey) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  const values = JSON.parse(valuesString as string);

  // Validate with Zod
  const parsed = SaveSchema.safeParse({ templateKey, values });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    // Get existing event data
    const event = await getEventById(eventId);

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Update thumbnail
    const thumbImage = await createThumbnail(eventId);
    const imagePath = await uploadImage({
      file: thumbImage,
      specPath: `thumbnails/${eventId}`,
    });

    // Delete old thumbnail
    if (event.thumb) {
      await deleteObject(event.thumb);
    }

    // Gallery management with type guard
    let currentGallery: string[] = [];

    // Type guard to ensure configJson is an object
    if (
      event.configJson &&
      typeof event.configJson === "object" &&
      !Array.isArray(event.configJson)
    ) {
      const config = event.configJson as Record<string, unknown>;
      if (Array.isArray(config.gallery)) {
        currentGallery = config.gallery.filter(
          (item): item is string => typeof item === "string",
        );
      }
    }

    // 1. Remove deleted images from gallery
    if (imageDeleted.length > 0) {
      // Filter out deleted paths
      currentGallery = currentGallery.filter(
        (path) => !imageDeleted.includes(path),
      );

      // Delete from storage
      await Promise.all(
        imageDeleted.map(async (path) => {
          await deleteObject(path);
        }),
      );
    }

    // 2. Upload new images
    if (imageUpload.length > 0) {
      const newImagePaths = await Promise.all(
        imageUpload.map(async (image) => {
          const imagePath = await uploadImage({
            file: image,
            specPath: `gallery/${eventId}`,
          });
          return imagePath;
        }),
      );

      // Append to existing gallery
      currentGallery = [...currentGallery, ...newImagePaths];
    }

    // 3. Merge gallery into values
    const enrichedValues = {
      ...values,
      gallery: currentGallery,
    };

    // Update database with updated gallery
    await updateEvent({
      id: eventId,
      configJson: enrichedValues,
      thumb: imagePath,
    });

    return NextResponse.json({
      success: true,
      data: {
        gallery: currentGallery,
        thumb: imagePath,
      },
    });
  } catch (e: unknown) {
    console.log((e as Error).message);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
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

  if (event.invitations.length > 0) {
    await deleteInvitationsByIds(event.invitations.map((i) => i.id));
  }

  const r = await deleteEventById(eventId);

  // Check if configJson has a gallery field
  const cfg = (r.configJson ?? {}) as { [key: string]: unknown };
  const gallery =
    Array.isArray(cfg.gallery) &&
    cfg.gallery.every((x) => typeof x === "string")
      ? (cfg.gallery as string[])
      : undefined;

  // Delete gallery images
  if (gallery) {
    await Promise.all(
      gallery.map(async (path) => {
        await deleteObject(path);
      }),
    );
  }

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
