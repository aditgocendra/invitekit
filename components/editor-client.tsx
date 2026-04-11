"use client";

import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DraftConfigMessage } from "@/types/preview-frame";
import Link from "next/link";
import { Globe, RefreshCcw, Trash2 } from "lucide-react";
import { DialogConfirmation } from "./dialog/dialog-confirmation";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { useLoading } from "@/hooks/use-loading";
import { EventStatusType } from "@/types/event";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type EditorClientProps<TConfig> = {
  eventId: string;
  slug: string;
  templateKey: string;
  thumb: string;
  config: TConfig;
  status: EventStatusType;
  FormComponent: (props: {
    templateKey: string;
    thumb: string;
    config?: TConfig;
    eventId: string;
  }) => React.ReactNode;
};

export default function EditorClient<TConfig>({
  eventId,
  slug,
  templateKey,
  thumb,
  config,
  status,
  FormComponent,
}: EditorClientProps<TConfig>) {
  const { withLoading } = useLoading();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<TConfig>;
      const msg: DraftConfigMessage<TConfig> = {
        type: "DRAFT_CONFIG",
        payload: ce.detail,
      };

      iframeRef.current?.contentWindow?.postMessage(
        msg,
        window.location.origin,
      );
    };

    window.addEventListener("INVITEKIT_FORM_DRAFT", handler);
    return () => window.removeEventListener("INVITEKIT_FORM_DRAFT", handler);
  }, []);

  // Delete

  // Dialog State
  const [dialogDelete, setDialogDelete] = useState(false);

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
      const res = await fetch(`/api/event?id=${eventId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        redirect("/dashboard/wedding");
      }

      toast("Delete Event", {
        duration: 3000,
        position: "top-center",
        description: "Failed",
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

  const [statusSelected, setStatusSelected] = useState<EventStatusType>(status);

  const handleStatus = async (status: EventStatusType) => {
    await withLoading(async () => {
      const res = await fetch(`/api/event/status?id=${eventId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      const json = await res.json();

      toast("Update Status", {
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

      if (res.ok) {
        setStatusSelected(status);
      }
    });
  };

  return (
    <div className='h-screen flex flex-col gap-2'>
      <DialogConfirmation
        title='Delete  Event'
        desc='Are you sure delete this event ? This action cannot be undone.'
        open={dialogDelete}
        setOpen={handleDialogDelete}
        onDelete={handleDelete}
      />

      <div className='flex shrink-0 justify-between items-center bg-card rounded-lg p-2 shadow-card border border-border'>
        <h2 className='font-bold'>Decoration</h2>
        <div className='space-x-2.5'>
          <Button
            variant={"destructive"}
            type='button'
            onClick={() => handleDialogDelete()}>
            <Trash2 />
          </Button>

          <Button
            variant='outline'
            type='button'
            onClick={() => iframeRef.current?.contentWindow?.location.reload()}>
            <RefreshCcw />
          </Button>

          <Link
            href={`/e/${slug}`}
            target='_blank'
            className={buttonVariants()}>
            <Globe />
          </Link>
        </div>
      </div>

      <div className='flex shrink-0 justify-between items-center bg-card rounded-lg p-2 shadow-card border border-border'>
        <h2 className='font-bold'>Status</h2>

        <Select
          onValueChange={handleStatus}
          value={statusSelected}>
          <SelectTrigger className='w-full max-w-48'>
            <SelectValue placeholder='Select a status' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Status</SelectLabel>
              {Object.values(EventStatusType).map((status) => (
                <SelectItem
                  key={status}
                  value={status}>
                  {status[0].toUpperCase() + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-1 min-h-0 gap-2'>
        <div className='min-w-[320px] w-[320px] min-h-0 bg-card rounded-lg p-4 shadow-card border border-border overflow-y-auto'>
          {FormComponent({ templateKey, config, eventId, thumb })}
        </div>

        <div className='flex-1 min-h-0 rounded-xl shadow-card border border-border p-2.5 overflow-hidden'>
          <iframe
            ref={iframeRef}
            className='w-full h-full'
            src={`/preview?id=${eventId}`}
          />
        </div>
      </div>
    </div>
  );
}
