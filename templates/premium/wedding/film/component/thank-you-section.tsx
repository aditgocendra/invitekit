import { RefObject } from "react";
import CardGaleries from "./card-galleries";

const DEFAULT_MESSAGE =
  "We would like to thank you for sharing in our wedding celebration. We are truly grateful for your presence, warmth, and kind wishes. We look forward to our future together and creating more wonderful memories with you.";

export default function ThanksSection({
  ref,
  images,
  message,
}: {
  message?: string;
  images?: string[];
  ref: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={ref}
      className='w-full min-h-screen'>
      <div className='relative'>
        <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

        <div className='absolute inset-0 flex flex-col items-center gap-16 w-full sm:min-w-xl p-16'>
          <h1 className='font-oswald tracking-widest w-full text-4xl sm:text-8xl font-bold text-center text-white'>
            <span className='text-white/50'>Thank</span> You
          </h1>

          <p className='w-full font-alexandria text-sm sm:text-xl text-white text-center'>
            {message || DEFAULT_MESSAGE}
          </p>

          <CardGaleries images={images} />

          <span className='font-oswald text-3xl sm:text-6xl text-white'>
            Groom & Bride
          </span>
        </div>
      </div>
    </section>
  );
}
