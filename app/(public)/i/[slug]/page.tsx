import {
  getInvitationBySlug,
  updateOpenedStatus,
} from "@/services/invitation/invitation.services";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { JsonValue } from "@/types/json";
import { notFound } from "next/navigation";

export default async function PrivateInvitation({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await getInvitationBySlug(slug);

  if (!invitation) return notFound();

  const template = TEMPLATE_REGISTRY[invitation.event.templateKey];

  if (!template) return notFound();

  if (!invitation.openedAt)
    await updateOpenedStatus({ id: invitation.id, openedAt: new Date() });

  return (
    <template.Component
      config={invitation.event.configJson as JsonValue}
      invitationId={invitation.id}
      guestName={invitation.name}
    />
  );
}
