import { auth } from "@/lib/auth";
import { deleteObject, getSignedUrlForUpload } from "@/lib/s3";
import {
  getEventById,
  updateEvent,
} from "@/services/invitation/event.services";
import { MultipleImageSchema } from "@/validation/image.validation";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const Schema = z.object({
  eventId: z.string(),
  images: MultipleImageSchema,
});

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

  const eventId = formData.get("eventId") as string;
  const images = formData.getAll("images") as File[];

  const parsed = Schema.safeParse({ eventId, images });

  if (!parsed.success) {
    console.log(parsed.error.format());
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  //   const { eventId, images } = parsed.data;

  const event = await getEventById(eventId);

  if (!event) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  if (event.userId !== session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const newImagePaths = await Promise.all(
    images.map(async (image) => {
      const imagePath = await uploadImage({
        file: image,
        specPath: `gallery/${eventId}`,
      });
      return imagePath;
    }),
  );

  let currentGallery: string[] = [];

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

  currentGallery = [...currentGallery, ...newImagePaths];

  const baseConfig = (
    event.configJson &&
    typeof event.configJson === "object" &&
    !Array.isArray(event.configJson)
      ? (event.configJson as Record<string, unknown>)
      : {}
  ) as Record<string, unknown>;

  const updatedConfigJson = {
    ...baseConfig,
    gallery: currentGallery,
  };

  await updateEvent({
    id: eventId,
    configJson: updatedConfigJson, // ✅ Sekarang TypeScript happy
  });

  return NextResponse.json({ message: "Success" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  const event = await getEventById(eventId);

  if (event?.userId !== session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();

  const { imageSelected } = json;
  const imagePaths = imageSelected as string[];

  if (imagePaths.length === 0) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  try {
    await Promise.all(
      imagePaths.map(async (path) => {
        await deleteObject(path);
      }),
    );
  } catch {
    return NextResponse.json({ message: "Something Wrong" }, { status: 500 });
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
  if (imagePaths.length > 0) {
    // Filter out deleted paths
    currentGallery = currentGallery.filter(
      (path) => !imagePaths.includes(path),
    );

    // Delete from storage
    await Promise.all(
      imagePaths.map(async (path) => {
        await deleteObject(path);
      }),
    );
  }

  const baseConfig = (
    event.configJson &&
    typeof event.configJson === "object" &&
    !Array.isArray(event.configJson)
      ? (event.configJson as Record<string, unknown>)
      : {}
  ) as Record<string, unknown>;

  const updatedConfigJson = {
    ...baseConfig,
    gallery: currentGallery,
  };

  await updateEvent({
    id: eventId,
    configJson: updatedConfigJson, // ✅ Sekarang TypeScript happy
  });

  return NextResponse.json({ message: "Success" }, { status: 200 });
}
