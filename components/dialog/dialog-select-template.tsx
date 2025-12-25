import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import Image from "next/image";

export function DialogSelectTemplate() {
  const templates = Object.values(TEMPLATE_REGISTRY);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>Create Something</Button>
        </DialogTrigger>
        <DialogContent
          className='sm:max-w-[725px]'
          showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Create Invitation</DialogTitle>
            <DialogDescription>
              Select templates for your invitation
            </DialogDescription>
          </DialogHeader>

          <div className='grid grid-cols-4'>
            {templates.map((template) => (
              <div key={template.key}>
                <div className='relative group'>
                  <Image
                    src={template.previewImage}
                    width={169}
                    height={300}
                    alt={template.name}
                    className='object-cover rounded-xl shadow-md'
                  />

                  {/* Overlay gradient */}
                  <div className='absolute inset-0 rounded-xl bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                  {/* Button */}
                  <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                    <Button
                      size='sm'
                      className='min-w-20 rounded-full text-xs'>
                      Select
                    </Button>

                    <Button
                      variant='secondary'
                      size='sm'
                      className='min-w-20 rounded-full text-xs'>
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
