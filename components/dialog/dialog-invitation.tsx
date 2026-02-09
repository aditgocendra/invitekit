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
import { UserPlus } from "lucide-react";
import FormInvitation from "../form/form-invitation";
import { InvitationEventFormSchema } from "@/validation/event.validation";
import z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/hooks/use-loading";

type InvitationEventInput = z.infer<typeof InvitationEventFormSchema>;
export function DialogInvitation({ eventId }: { eventId: string }) {
  const { withLoading } = useLoading();
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const onSubmit = async (data: InvitationEventInput) => {
    await withLoading(async () => {
      const r = await fetch(`/api/event/invitation?eventId=${eventId}`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (r.ok) {
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
        <Button
          variant='outline'
          size='sm'>
          <UserPlus className='mx-1' />
          <span className='hidden lg:inline'>Invite</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Invite Guest</DialogTitle>
          <DialogDescription>Invite guest to your wedding.</DialogDescription>
        </DialogHeader>
        <FormInvitation onSubmit={onSubmit} />
        <DialogFooter className='sm:justify-start'></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
