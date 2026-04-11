import { EventStatus } from "@/lib/generated/enums";

export type EventStatusType = EventStatus;

export const EventStatusType = {
  DRAFT: "DRAFT" as EventStatusType,
  ARCHIVED: "ARCHIVED" as EventStatusType,
  PUBLISHED: "PUBLISHED" as EventStatusType,
} as const;