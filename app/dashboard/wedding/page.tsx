import { DialogSelectTemplate } from "@/components/dialog/dialog-select-template";
import { Button } from "@/components/ui/button";

import { TEMPLATE_REGISTRY } from "@/templates/registry";
import Image from "next/image";

export default function Wedding() {
  const entry = Object.values(TEMPLATE_REGISTRY);

  return (
    <>
      <div className='flex justify-between items-center mt-2 mx-1'>
        <h1 className='text-2xl font-bold'>Invitation</h1>
        <DialogSelectTemplate />
      </div>
      <div className='grid grid-cols-6 gap-4'>
        {entry.map((template) => (
          <div
            key={template.key}
            className='w-full'>
            <div className='relative w-full aspect-169/300 overflow-hidden rounded-xl shadow-md group'>
              <Image
                src={template.previewImage}
                alt={template.name}
                fill
                sizes='(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw'
                className='object-cover'
              />

              <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
                <Button
                  variant='secondary'
                  size='sm'
                  className='min-w-20 rounded-full text-xs'>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className='flex h-screen items-center justify-center'>
        <div className='text-center space-y-4'>
          <p className='text-muted-foreground'>
            No invitations have been made yet
          </p>
        </div>
      </div> */}
    </>
  );
}
