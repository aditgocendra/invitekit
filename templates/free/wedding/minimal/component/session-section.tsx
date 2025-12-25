import Image from "next/image";
import { RefObject } from "react";

export default function SessionSection({
  ref,
  scrollToView,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3") => void;
}) {
  return (
    <section
      ref={ref}
      className='w-full max-w-xl lg:max-w-2xl '>
      <div className='relative'>
        <Image
          src='/assets/templates/free/wedding/minimal/bg-session.webp'
          width={900}
          height={1600}
          className='h-screen w-full object-cover'
          alt='Wedding Minimal Template'
        />

        <div className='w-full absolute bottom-1/3 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-8'>
          <h1 className='w-full text-lg font-bold text-center mb-2'>
            Please join us to celebrate the wedding of
          </h1>

          <p className='font-parisienne text-6xl font-bold text-center'>
            Peter <br />& <br />
            Siti
          </p>

          <div className='flex flex-col items-center gap-4'>
            <h3 className='text-2xl font-semibold'>MARCH</h3>

            <div className='w-full flex gap-8 justify-center items-center'>
              <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                SATURDAY
              </p>
              <p className='text-6xl font-bold'>31</p>
              <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                AT 08:00 PM
              </p>
            </div>
            <p className='text-2xl font-semibold'>2026</p>

            <div className='text-center mt-8'>
              <p className='text-2xl font-bold'>Graha Wangsa Ballroom</p>

              <p className='text-lg'>
                Jalan Sultan Iskandar Muda, Jakarta Selatan
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
