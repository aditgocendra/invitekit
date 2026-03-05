import EditorClient from "@/components/editor-client";
import { getEventById } from "@/services/invitation/event.services";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import type { JsonValue } from "@/types/json";
import { notFound } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DecorationPage({ searchParams }: PageProps) {
  const { id } = await searchParams;

  if (typeof id !== "string") return notFound();

  const event = await getEventById(id);
  if (!event) return notFound();

  const template = TEMPLATE_REGISTRY[event.templateKey];
  if (!template) return notFound();

  const config = event.configJson as JsonValue;

  return (
    <EditorClient<JsonValue>
      eventId={event.id as string}
      slug={event.slug}
      templateKey={template.key}
      config={config}
      FormComponent={template.FormComponent}
    />
  );
}
