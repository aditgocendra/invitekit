import { auth } from "@/lib/auth";
import { EventStatus } from "@/lib/generated/enums";
import {
  getEventById,
  updateEvent,
} from "@/services/invitation/event.services";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const SCHEMA = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export async function PUT(req: NextRequest) {
  const session = await auth();

  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const event = await getEventById(eventId);

  if (!event)
    return NextResponse.json({ message: "Event not found" }, { status: 404 });

  if (event.userId !== session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = SCHEMA.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    await updateEvent({
      id: eventId,
      status: parsed.data.status as EventStatus,
    });

    return NextResponse.json(
      { message: "Success update status" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
