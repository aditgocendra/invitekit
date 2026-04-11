"use client";

import { EventStatus, EventType } from "@/lib/generated/enums";
import Image from "next/image";
import { Spinner } from "./ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { buttonVariants } from "./ui/button";
import {
  FolderKanban,
  Fullscreen,
  MoreHorizontalIcon,
  Trash2,
  Wallpaper,
} from "lucide-react";
import Link from "next/link";
import { JsonValue } from "@/lib/generated/internal/prismaNamespace";
import { DialogConfirmation } from "./dialog/dialog-confirmation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";
import { toast } from "sonner";

export default function GridEvent({
  data,
}: {
  data: {
    type: EventType;
    templateKey: string;
    thumb: string | null;
    id: string;
    status: EventStatus;
    slug: string;
    isPublic: boolean;
    configJson: JsonValue;
    createdAt: Date;
    userId: string;
  }[];
}) {
  const { withLoading } = useLoading();
  const { refresh } = useRouter();

  // Dialog State
  const [dialogDelete, setDialogDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Delete Dialog Confirmation
  const handleDialogDelete = () => {
    if (dialogDelete) {
      setDialogDelete(false);
    } else {
      setDialogDelete(true);
    }
  };

  const handleDelete = async () => {
    await withLoading(async () => {
      const res = await fetch(`/api/event?id=${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteId(null);
        refresh();
      }

      const json = await res.json();

      toast("Delete Event", {
        duration: 3000,
        position: "top-center",
        description: json.message,
        richColors: true,
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    });
  };

  return (
    <div className='grid grid-cols-6 gap-4'>
      <DialogConfirmation
        title='Delete  Event'
        desc='Are you sure delete this event ? This action cannot be undone.'
        open={dialogDelete}
        setOpen={handleDialogDelete}
        onDelete={handleDelete}
      />

      {data.map((d, index) => {
        const config = d.configJson as Record<string, unknown>;

        const brideName = (config.brideName as string) || "";
        const groomName = (config.groomName as string) || "";

        return (
          <div
            key={d.id}
            className='relative w-full aspect-9/16 overflow-hidden rounded-xl group shadow-card border border-border'>
            <div className='relative w-full h-full'>
              {d.thumb ? (
                <Image
                  src={`https://s3.nevaobjects.id/invitekit-bucket/${d.thumb}`}
                  alt={`image_event_thumb_${index}`}
                  fill
                  sizes='(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw'
                  className='object-cover'
                />
              ) : (
                <div className='absolute inset-0 flex items-center justify-center'>
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
                  <DropdownMenuItem
                    onClick={() => {
                      setDeleteId(d.id);
                      handleDialogDelete();
                    }}>
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
  );
}
