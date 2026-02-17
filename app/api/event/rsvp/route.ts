import { getInvitationById } from "@/services/invitation/invitation.services";
import { createRsvp } from "@/services/invitation/rsvp.services";
import { RsvpFormSchema } from "@/validation/rsvp.validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = RsvpFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const invitation = await getInvitationById(parsed.data.invitationId);

  if (!invitation)
    return NextResponse.json(
      { message: "Invitation Not Valid" },
      { status: 400 },
    );

  if (invitation.rsvp) {
    return NextResponse.json({ message: "You already RSVP" }, { status: 400 });
  }

  try {
    await createRsvp({
      invitationId: parsed.data.invitationId,
      isAttendance: parsed.data.attendance,
      message: parsed.data.message,
    });

    return NextResponse.json(
      { message: "Confirm success, thanks for RSVP" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
