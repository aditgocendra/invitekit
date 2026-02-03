import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

interface DialogConfirmationProps {
  title: string;
  desc: string;
  open: boolean;
  setOpen: () => void;
  onDelete: () => void;
  onClose?: () => void;
}

export const DialogConfirmation = ({
  title,
  desc,
  open,
  setOpen,
  onDelete,
  onClose,
}: DialogConfirmationProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        setOpen();
        if (!open) onClose!();
      }}>
      <DialogContent className='sm:max-w-lg p-0'>
        <DialogTitle className='hidden'>{title}</DialogTitle>

        <div className='flex gap-4 p-6'>
          <div className='w-10 h-10 p-2 bg-red-200 rounded-full'>
            <Info className='text-red-600' />
          </div>
          <div className='space-y-1'>
            <h3 className='text-lg font-bold'>{title}</h3>
            <p className='text-gray-400'>{desc}</p>
          </div>
        </div>
        <DialogFooter className='bg-secondary p-2.5 rounded-b-lg'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              setOpen();
              onDelete();
            }}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
