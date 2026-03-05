import { getEventById } from "@/services/invitation/event.services";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import type { JsonValue } from "@/types/json";
import { notFound } from "next/navigation";
import ClientPreviewWrapper from "./ClientPreviewWrapper"; // Import client wrapper

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PreviewPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const { id } = resolvedParams;

  if (typeof id !== "string") return notFound();

  const event = await getEventById(id);
  if (!event) return notFound();

  const template = TEMPLATE_REGISTRY[event.templateKey];
  if (!template) return notFound();

  return (
    <ClientPreviewWrapper
      initialConfig={event.configJson as JsonValue}
      TemplateComponent={template.Component}
    />
  );
}
