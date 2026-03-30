import GridEvent from "@/components/grid-event";
import { buttonVariants } from "@/components/ui/button";

import { auth } from "@/lib/auth";
import { getEventByUserId } from "@/services/invitation/event.services";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Wedding() {
  const session = await auth();

  if (!session?.user) redirect("/sign-in");

  const data = await getEventByUserId(session.user.id);

  return (
    <>
      <div className='flex justify-between items-center mt-2 mx-1'>
        <h1 className='text-2xl font-bold'>Manage Wedding</h1>

        <Link
          href='/dashboard/wedding/create'
          className={buttonVariants({ size: "sm" })}>
          Create Event
        </Link>
      </div>
      <GridEvent data={data} />
    </>
  );
}
