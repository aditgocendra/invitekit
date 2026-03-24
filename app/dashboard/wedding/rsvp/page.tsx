import TableInvitation from "@/components/table/table-invitation";
import { getInvitationByEventId } from "@/services/invitation/invitation.services";
import { InvitationDTO } from "@/types/rsvp";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RSVP({ searchParams }: PageProps) {
  const { id, search, page, limit, sort, sortBy } = await searchParams;

  const limitPerPage = limit ? parseInt(limit as string) : 10;
  const pageActive = page ? parseInt(page as string) : 1;

  const data = await getInvitationByEventId({
    eventId: id as string,
    name: search as string,
    take: limitPerPage,
    skip: pageActive === 1 ? 0 : limitPerPage * (pageActive - 1),
    sort: sort as "asc" | "desc",
    sortBy: sortBy as string,
  });

  const invitations = data.invitations as InvitationDTO[];
  const count = data.count;

  return (
    <>
      <TableInvitation
        data={invitations}
        totalPages={Math.ceil(count / limitPerPage)}
      />
    </>
  );
}
