import { Prisma } from "@/lib/generated/client";
import { SentStatus } from "@/lib/generated/enums";
import { prisma } from "@/lib/prisma.init";

interface GetInvitationByEventIdProps {
  take?: number;
  skip?: number;
  sort?: "asc" | "desc";
  sortBy?: string;
  name?: string;
  eventId: string;
}

export const getInvitationByEventId = async (
  props: GetInvitationByEventIdProps,
) => {
  const orderBy: Prisma.InvitationOrderByWithRelationInput =
    props.sortBy && props.sort
      ? { [props.sortBy]: props.sort }
      : { sentAt: "desc" as Prisma.SortOrder };

  const [invitations, count] = await prisma.$transaction([
    prisma.invitation.findMany({
      take: props.take,
      skip: props.skip,
      orderBy,
      where: {
        eventId: props.eventId,
        name: { contains: props.name, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        sentAt: true,
        slug: true,
        sentStatus: true,
        openedAt: true,
        rsvp: true,
      },
    }),
    prisma.invitation.count({
      where: {
        eventId: props.eventId,
        name: { contains: props.name, mode: "insensitive" },
      },
    }),
  ]);

  return { invitations, count };
};

export const getInvitationById = async (id: string) => {
  return await prisma.invitation.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      phone: true,
      event: { select: { userId: true, configJson: true } },
      rsvp: true,
    },
  });
};

export const getInvitationsByIds = async (ids: string[]) => {
  return await prisma.invitation.findMany({
    where: {
      id: { in: ids },
    },
    include: {
      event: {
        select: {
          userId: true,
        },
      },
    },
  });
};

export const getInvitationBySlug = async (slug: string) => {
  return await prisma.invitation.findUnique({
    where: { slug },
    include: { event: true },
  });
};

interface CreateInvitationEventProps {
  name: string;
  phone: string;
  token: string;
  eventId: string;
  slug: string;
  sentAt: Date;
}

export const createInvitation = async (data: CreateInvitationEventProps) => {
  return await prisma.invitation.create({
    data: {
      name: data.name,
      phone: data.phone,
      sentAt: data.sentAt,
      sentStatus: SentStatus.PENDING,
      token: data.token,
      slug: data.slug,
      eventId: data.eventId,
    },
  });
};

export const updateOpenedStatus = async ({
  id,
  openedAt,
}: {
  id: string;
  openedAt: Date;
}) => {
  return await prisma.invitation.update({
    where: { id },
    data: { openedAt },
  });
};

export const updateSentStatus = async ({
  id,
  sentStatus,
}: {
  id: string;
  sentStatus: SentStatus;
}) => {
  return await prisma.invitation.update({
    where: { id },
    data: { sentStatus },
  });
};

export const deleteInvitationsByIds = async (ids: string[]) => {
  return await prisma.invitation.deleteMany({
    where: {
      id: { in: ids },
    },
  });
};
