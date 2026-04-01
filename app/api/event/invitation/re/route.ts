import { generateWhatsAppGuestInvitationMessage } from "@/components/template-message/invitation";
import { auth } from "@/lib/auth";
import { sendWhatsApp } from "@/lib/wa-helper";
import {
  getInvitationById,
  updateSentStatus,
} from "@/services/invitation/invitation.services";
import { SentStatusType } from "@/types/rsvp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  //   Check User Session
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const invitationId = searchParams.get("invitationId");

  //   Check Invitation ID
  if (!invitationId)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const invitation = await getInvitationById(invitationId);

  if (!invitation) {
    return NextResponse.json(
      { message: "Invitation not found" },
      { status: 404 },
    );
  }

  //   Check Event Owner
  if (invitation?.event.userId !== session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = invitation.event.configJson as Record<string, unknown>;

    const brideName = (config.brideName as string) || "";
    const groomName = (config.groomName as string) || "";
    const guestName = (config.guestName as string) || "";

    const message = generateWhatsAppGuestInvitationMessage({
      link: `${process.env.NEXT_PUBLIC_APP_URL}/i/${invitation.slug}`,
      groomBrideName: `${groomName} & ${brideName}`,
      guestName: guestName,
    });

    const r = await sendWhatsApp({
      target: invitation.phone!,
      message,
    });

    await updateSentStatus({
      id: invitation.id,
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
