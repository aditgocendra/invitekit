import { getEventBySlug } from "@/services/invitation/event.services";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { EventStatusType } from "@/types/event";
import { JsonValue } from "@/types/json";
import { notFound } from "next/navigation";

export default async function PublicEvent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  if (event.status !== EventStatusType.PUBLISHED) return notFound();

  const template = TEMPLATE_REGISTRY[event.templateKey];

  if (!template) return notFound();

  return <template.Component config={event.configJson as JsonValue} />;
}
