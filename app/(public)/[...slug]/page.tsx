import { getEventById } from "@/services/invitation/event.services";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import { JsonValue } from "@/types/json";
import { notFound } from "next/navigation";

export default async function invitationDigital({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const event = await getEventById(slug[0]);

  if (!event) return notFound();

  const template = TEMPLATE_REGISTRY[event.templateKey];

  if (!template) return notFound();

  return <template.Component config={event.configJson as JsonValue} />;
}
