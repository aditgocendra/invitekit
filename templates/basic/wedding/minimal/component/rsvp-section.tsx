import { DialogRsvp } from "@/components/dialog/dialog-rsvp";
import { ChevronsDown } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";

const DEFAULT_IMAGES = [
  "template/wedding/basic/rsvp-1.webp",
  "template/wedding/basic/rsvp-2.webp",
];

export default function RsvpSection({
  ref,
  images,
  invitationId,
  scrollToView,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;
  invitationId?: string;
  images?: string[];
}) {
  const image1 = images ? images[0] : DEFAULT_IMAGES[0];
  const image2 = images && images.length > 1 ? images[1] : DEFAULT_IMAGES[1];

  return (
    <section
      ref={ref}
      className='w-full max-w-xl lg:max-w-2xl '>
      <div className='relative'>
        <Image
          src='/assets/templates/basic/wedding/minimal/bg-rsvp.webp'
          width={900}
          height={1600}
          className='h-screen w-full object-cover'
          alt='RSVPWedding Minimal Template'
        />

        <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

        <div className='absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-6'>
          <div className='relative p-1 rounded-lg w-100 h-100'>
            <div className='absolute top-4 left-1/2 -translate-x-1/3 bg-white p-1 rounded-lg rotate-3'>
              <Image
                src={
                  image1.startsWith("blob:") // ✅ Blob URL dari createObjectURL
                    ? image1
                    : `https://s3.nevaobjects.id/invitekit-bucket/${image1}` // ✅ S3 path
                }
                width={200}
                height={200}
                className='object-cover rounded-sm '
                alt='RSVPWedding Minimal Template'
              />
            </div>

            <div className='absolute bottom-4 right-1/2 translate-x-1/3 bg-white p-1 rounded-lg -rotate-3'>
              <Image
                src={
                  image2.startsWith("blob:")
                    ? image2
                    : `https://s3.nevaobjects.id/invitekit-bucket/${image2}`
                }
                width={200}
                height={200}
                className='object-cover rounded-sm'
                alt='RSVPWedding Minimal Template'
              />
            </div>
          </div>

          <p className='font-fredoka w-full text-xl text-white text-center'>
            Please help us prepare by confirming your attendance at our wedding
            through the form below and sending your good wishes
          </p>

          <DialogRsvp invitationId={invitationId} />
        </div>

        <button
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'
          onClick={() => scrollToView("view5")}>
          <ChevronsDown
            size={32}
            className='text-white'
          />
        </button>
      </div>
    </section>
  );
}
