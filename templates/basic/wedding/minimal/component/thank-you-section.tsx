import Image from "next/image";
import { RefObject } from "react";

const DEFAULT_MESSAGE =
  "We would like to thank you for sharing in our wedding celebration. We are truly grateful for your presence, warmth, and kind wishes. We look forward to our future together and creating more wonderful memories with you.";

export default function ThanksSection({
  ref,
  message,
}: {
  message?: string;
  ref: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section
      ref={ref}
      className='w-full max-w-xl lg:max-w-2xl '>
      <div className='relative'>
        <Image
          src='/assets/templates/basic/wedding/minimal/bg-thanks.webp'
          width={900}
          height={1600}
          className='h-screen w-full object-cover'
          alt='Wedding Minimal Template'
        />

        <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

        <div className='absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-16 min-w-xl'>
          <h1 className='font-the-nautigal w-full text-8xl font-bold text-center'>
            Thank You
          </h1>
          <p className='w-full font-fredoka text-2xl font-semibold text-white text-center'>
            {message || DEFAULT_MESSAGE}
          </p>

          <div className='flex flex-col items-center justify-center text-yellow-600 text-center'>
            <p className='font-the-nautigal text-8xl'>Darrel</p>
            <p className='font-the-nautigal text-6xl'>&</p>
            <p className='font-the-nautigal text-8xl'>Bunga</p>
          </div>
        </div>
      </div>
    </section>
  );
}
