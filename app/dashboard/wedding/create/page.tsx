import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TEMPLATE_REGISTRY } from "@/templates/registry";
import Image from "next/image";
import Link from "next/link";

export default async function CreateInvitation() {
  const templates = Object.values(TEMPLATE_REGISTRY);

  return (
    <>
      <h1 className='font-bold text-xl flex flex-col'>
        Select Template
        <span className='font-normal text-sm text-secondary-foreground'>
          Select a template to get started
        </span>
      </h1>

      <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4'>
        {templates.map((template) => (
          <div
            key={template.key}
            className='group'>
            <div className='relative aspect-9/16 w-full overflow-hidden rounded-xl shadow-md'>
              <Image
                src={template.previewImage}
                alt={template.name}
                fill
                sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw'
                className='object-cover'
              />

              <div className='absolute inset-0 rounded-xl bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size='sm'
                      className='min-w-20 text-xs'>
                      Chose
                    </Button>
                  </DialogTrigger>

                  <DialogContent
                    className='sm:max-w-[725px] max-h-[95vh] flex flex-col '
                    showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>Create Invitation</DialogTitle>
                      <DialogDescription>
                        Please fill the form
                      </DialogDescription>
                    </DialogHeader>

                    <div className='overflow-y-auto flex-1 min-h-0 pr-2'>
                      <template.FormComponent templateKey={template.key} />
                    </div>
                  </DialogContent>
                </Dialog>

                <Link
                  href={`/preview/template?key=${template.key}`}
                  target='_blank'
                  className={`${buttonVariants({ size: "sm" })} min-w-20 text-xs`}>
                  Preview
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
