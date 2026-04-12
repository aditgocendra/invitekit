import TableInvitation from "@/components/table/table-invitation";
import { getInvitationByEventId } from "@/services/invitation/invitation.services";
import { InvitationDTO } from "@/types/rsvp";
import {
  ClipboardList,
  MailOpenIcon,
  SendIcon,
  UsersRoundIcon,
} from "lucide-react";

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
  const count = data.total;

  const dataStats = [
    {
      icon: UsersRoundIcon,
      title: "Total Invitation",
      value: data.total.toString(),
    },
    {
      icon: SendIcon,
      title: "Sented",
      value: data.totalSented.toString(),
    },
    {
      icon: MailOpenIcon,
      title: "Opened",
      value: data.totalOpened.toString(),
    },
    {
      icon: ClipboardList,
      title: "Attendance",
      value: data.totalAttendance.toString(),
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {dataStats.map((d, index) => (
          <div
            key={index}
            className='bg-card rounded-xl p-6 shadow-card border border-border'>
            <div className='flex justify-between gap-2'>
              <div className='space-y-4'>
                <h3 className='font-body font-bold'>{d.title}</h3>

                <div className='font-headline font-semibold text-3xl'>
                  {d.value}
                </div>
              </div>

              <div className='w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center'>
                <d.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <TableInvitation
        data={invitations}
        totalPages={Math.ceil(count / limitPerPage)}
      />
    </div>
  );
}
