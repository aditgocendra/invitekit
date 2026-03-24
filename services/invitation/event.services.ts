import { EventType } from "@/lib/generated/enums";
import { prisma } from "@/lib/prisma.init";

interface CreateInvitationEventProps {
  userId: string;
  thumb?: string;
  templateKey: string;
  slug: string;
  type: EventType;
  configJson: {
    [key: string]: string | boolean | number | Date;
  };
}

export const createInvitationEvent = async (
  props: CreateInvitationEventProps,
) => {
  return await prisma.event.create({
    data: {
      userId: props.userId,
      templateKey: props.templateKey,
      thumb: props.thumb,
      configJson: props.configJson,
      type: props.type,
      slug: props.slug,
    },
  });
};

interface UpdateInvitationEventProps {
  id: string;
  thumb?: string;
  configJson?: {
    [key: string]: string | boolean | number | Date | string[];
  };
}

export const updateEvent = async (props: UpdateInvitationEventProps) => {
  return await prisma.event.update({
    where: { id: props.id },
    data: {
      configJson: props.configJson,
      thumb: props.thumb,
    },
  });
};

export const getEventByUserId = async (id: string) => {
  return await prisma.event.findMany({ where: { userId: id } });
};

export const getEventById = async (id: string) => {
  return await prisma.event.findUnique({
    where: { id },
    include: { invitations: true },
  });
};

export const getEventBySlug = async (slug: string) => {
  return await prisma.event.findUnique({ where: { slug } });
};

export const deleteEventById = async (id: string) => {
  return await prisma.event.delete({ where: { id } });
};
