import { SentStatus } from "@/lib/generated/enums";

export type SentStatusType = SentStatus;

export const SentStatusType = {
  PENDING: "PENDING" as SentStatusType,
  SUCCESS: "SUCCESS" as SentStatusType,
  FAIL: "FAIL" as SentStatusType,
} as const;

export type InvitationDTO = {
  id: string;
  name: string;
  phone: string | null;
  slug: string;
  sentAt: Date | null;
  openedAt: Date | null;
  sentStatus: SentStatusType;
  rsvp: {
    id: string;
    message: string | null;
    invitationId: string;
    isAttendance: boolean;
    respondedAt: Date | null;
  } | null;
};
