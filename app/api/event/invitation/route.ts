import { auth } from "@/lib/auth";
import { signInvitationToken } from "@/lib/token";
import { sendWhatsApp } from "@/lib/wa-helper";
import { getEventById } from "@/services/invitation/event.services";
import {
  createInvitation,
  deleteInvitationsByIds,
  getInvitationsByIds,
  updateSentStatus,
} from "@/services/invitation/invitation.services";
import { SentStatusType } from "@/types/rsvp";
import { InvitationEventFormSchema } from "@/validation/event.validation";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  //   Check User Session
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  //   Check Event ID
  if (!eventId)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const event = await getEventById(eventId);

  //   Check Event Owner
  if (event?.userId !== session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = InvitationEventFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const jti = crypto.randomUUID();

    const token = await signInvitationToken({
      type: "invitation-event",
      name: parsed.data.name,
      jti,
    });

    const slug = nanoid(6);

    const data = {
      name: parsed.data.name,
      phone: parsed.data.phoneNumber,
      token: token,
      slug: slug,
      eventId: eventId,
      sentAt: new Date(),
    };

    const inv = await createInvitation({ ...data });

    const message = `Haii please join us ${process.env.NEXT_PUBLIC_APP_URL}/i/${slug}`;

    const r = await sendWhatsApp({
      target: parsed.data.phoneNumber,
      message,
    });

    await updateSentStatus({
      id: inv.id,
      sentStatus: r.status ? SentStatusType.SUCCESS : SentStatusType.FAIL,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  //   Check User Session
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Check Ids
  const { ids } = await req.json();
  const selectedIds = ids as string[];

  if (!selectedIds || selectedIds.length === 0) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const invitations = await getInvitationsByIds(ids);

    // Check if all invitations exist
    if (invitations.length !== selectedIds.length) {
      return NextResponse.json(
        { message: "Some invitations not found" },
        { status: 404 },
      );
    }

    // Check if user owns all events
    const unauthorizedInvitation = invitations.find(
      (inv) => inv.event.userId !== session.user.id,
    );

    if (unauthorizedInvitation) {
      return NextResponse.json(
        { message: "Unauthorized to delete some invitations" },
        { status: 403 },
      );
    }

    const result = await deleteInvitationsByIds(selectedIds);

    return NextResponse.json(
      {
        message: `Deleted ${result.count} invitation success`,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
