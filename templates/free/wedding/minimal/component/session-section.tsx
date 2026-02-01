import { format } from "date-fns";
import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";

export default function SessionSection({
  ref,
  scrollToView,
  groomName,
  brideName,
  place,
  address,
  resepsiTime,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3") => void;
  groomName?: string;
  brideName?: string;
  place?: string;
  address?: string;
  resepsiTime?: Date;
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
            {groomName} <br />& <br />
            {brideName}
          </p>

          <div className='flex flex-col items-center gap-4'>
            <h3 className='text-2xl font-semibold'>
              {resepsiTime ? format(resepsiTime, "MMMM") : "-"}
            </h3>

            <div className='w-full flex gap-8 justify-center items-center'>
              <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                {resepsiTime ? format(resepsiTime, "EEEE") : "-"}
              </p>
              <p className='text-6xl font-bold'>{resepsiTime?.getDate()}</p>
              <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                AT {resepsiTime ? format(resepsiTime, "hh:mm aa") : "-"}
              </p>
            </div>
            <p className='text-2xl font-semibold'>
              {resepsiTime?.getFullYear()}
            </p>

            <div className='text-center mt-8'>
              <p className='text-2xl font-bold'>{place}</p>

              <p className='text-lg'>{address}</p>
            </div>
          </div>
        </div>

        <button
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'
          onClick={() => scrollToView("view1")}>
          <ChevronUp
            size={32}
            className='text-black'
          />
        </button>
      </div>
    </section>
  );
}
