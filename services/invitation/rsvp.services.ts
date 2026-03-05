import { prisma } from "@/lib/prisma.init";

interface CreateRsvpProps {
  invitationId: string;
  isAttendance: boolean;
  message?: string;
}

export const createRsvp = async (data: CreateRsvpProps) => {
  return await prisma.rsvp.create({ data });
};
