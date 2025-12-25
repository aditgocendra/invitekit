import FreeWeddingMinimalTemplate from "@/templates/free/wedding/minimal";

export default async function invitationDigital({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return (
    <FreeWeddingMinimalTemplate
      address='asdasd'
      brideName='asdasd'
      coupleName='asdasd'
      dateFormatted='asdasd'
      groomName='asdasd'
    />
  );
}
