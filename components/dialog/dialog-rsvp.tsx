import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCheckIcon } from "lucide-react";
import z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";
import { RsvpFormSchema } from "@/validation/rsvp.validation";
import FormAttendance from "../form/form-attendance";
import { toast } from "sonner";

type RsvpEventInput = z.infer<typeof RsvpFormSchema>;
export function DialogRsvp({ invitationId }: { invitationId?: string }) {
  const { withLoading } = useLoading();
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const onSubmit = async (data: RsvpEventInput) => {
    await withLoading(async () => {
      const r = await fetch(`/api/event/rsvp`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      const json = await r.json();

      if (r.ok) {
        toast("Confirm RSVP", {
          description: json.message,
          duration: 3000,
          position: "top-center",
          richColors: true,
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
        setOpen(false);
        refresh();
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='lg'>
          <CheckCheckIcon className='mx-1' />
          <span>Confirm Attendance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Confirm Attendance</DialogTitle>
          <DialogDescription>
            Please help us confirm your attendance.
          </DialogDescription>
        </DialogHeader>
        <FormAttendance
          defaultValues={{
            invitationId: invitationId,
            attendance: true,
          }}
          onSubmit={onSubmit}
        />
        <DialogFooter className='sm:justify-start'></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
