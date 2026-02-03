import { TEMPLATE_REGISTRY } from "@/templates/registry";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PreviewTemplate({ searchParams }: PageProps) {
  const { key } = await searchParams;
  const template = TEMPLATE_REGISTRY[key as string];

  return <template.Component config={{}} />;
}
