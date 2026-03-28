import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@/lib/auth";
import { getEventByUserId } from "@/services/invitation/event.services";

import { TEMPLATE_REGISTRY } from "@/templates/registry";
import {
  FolderKanban,
  Fullscreen,
  MoreHorizontalIcon,
  Trash2,
  Wallpaper,
} from "lucide-react";
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
        <h1 className='text-2xl font-bold'>Manage Wedding</h1>

        <Link
          href='/dashboard/wedding/create'
          className={buttonVariants({ size: "sm" })}>
          Create Event
        </Link>
      </div>
      <div className='grid grid-cols-6 gap-4'>
        {data.map((d) => {
          const template = TEMPLATE_REGISTRY[d.templateKey];

          const config = d.configJson as Record<string, unknown>;

          const brideName = (config.brideName as string) || "";
          const groomName = (config.groomName as string) || "";

          return (
            <div
              key={d.id}
              className='relative w-full aspect-9/16 overflow-hidden rounded-xl group shadow-card border border-border'>
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

              <div className='absolute inset-0 bg-linear-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

              <div className='absolute top-4 w-full flex justify-between items-center px-4'>
                <span className='bg-white px-2 py-1 text-xs font-semibold rounded-lg'>
                  {groomName || "Groom"} & {brideName || "Bride"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className={buttonVariants({
                      size: "sm",
                      variant: "outline",
                      className: "min-w-10 ",
                    })}>
                    <MoreHorizontalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-48 rounded-lg'>
                    <DropdownMenuItem asChild>
                      <Link
                        href={"/dashboard/wedding/rsvp?id=" + d.id}
                        className='flex gap-2'>
                        <FolderKanban className='text-muted-foreground' />
                        <span>Manage RSVP</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/wedding/decoration?id=${d.id}`}
                        className=' flex items-center gap-2'>
                        <Wallpaper className='text-muted-foreground' />
                        <span>Decoration</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/preview?id=${d.id}`}
                        target='_blank'
                        className='flex items-center gap-2'>
                        <Fullscreen className='text-muted-foreground' />
                        <span>Preview</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className='text-muted-foreground' />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
