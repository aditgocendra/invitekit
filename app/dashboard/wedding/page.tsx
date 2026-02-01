import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/auth";
import { getEventByUserId } from "@/services/invitation/event.services";

import { TEMPLATE_REGISTRY } from "@/templates/registry";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Wedding() {
  const session = await auth();

  if (!session?.user) redirect("/sign-in");

  const data = await getEventByUserId(session.user.id);

  return (
    <>
      <div className='flex justify-between items-center mt-2 mx-1'>
        <h1 className='text-2xl font-bold'>Invitation</h1>

        <Link
          href='/dashboard/wedding/create'
          className={buttonVariants({ size: "sm" })}>
          Create Invitation
        </Link>
      </div>
      <div className='grid grid-cols-6 gap-4'>
        {data.map((d) => {
          const template = TEMPLATE_REGISTRY[d.templateKey];
          return (
            <Link
              href={`/dashboard/wedding/decoration?id=${d.id}`}
              key={d.id}
              className='w-full'>
              <div className='relative w-full aspect-9/16 overflow-hidden rounded-xl group shadow-card border border-border'>
                <div className='(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw'>
                  {d.thumb ? (
                    <Image
                      src={`https://s3.nevaobjects.id/invitekit-bucket/${d.thumb}`}
                      alt={template.name}
                      fill
                      sizes='(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw'
                      className='object-cover'
                    />
                  ) : (
                    <div className='absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center'>
                      <Spinner />
                    </div>
                  )}
                </div>

                <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
