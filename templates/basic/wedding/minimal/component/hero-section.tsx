import { ChevronsDown } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";

export default function HeroSection({
  ref,
  scrollToView,
  groomName,
  brideName,
  parentGroomName,
  parentBrideName,
  akadDate,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;
  groomName: string | undefined;
  brideName: string | undefined;
  parentGroomName: string | undefined;
  parentBrideName: string | undefined;
  akadDate: string | undefined;
}) {
  return (
    <section
      ref={ref}
      className='w-full max-w-xl lg:max-w-2xl '>
      <div className='relative bg-linear-gradient'>
        <Image
          src='/assets/templates/basic/wedding/minimal/bg-hero.webp'
          width={900}
          height={1600}
          className='h-screen w-full object-cover'
          alt='Wedding Minimal Template'
        />

        <div className='absolute top-1/12 w-full'>
          <div className='flex flex-col items-center gap-6'>
            <p className='font-fredoka text-8xl text-yellow-500'>B | D</p>
            <p className='font-fredoka text-xl text-center max-w-40'>
              {akadDate}
            </p>
          </div>
        </div>

        <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent' />

        <div className='absolute bottom-1/5 w-full flex justify-around '>
          <div className='flex flex-col items-center gap-2'>
            <p className='font-the-nautigal text-8xl text-yellow-500'>
              {brideName || "Bride"}
            </p>
            <p className='font-fredoka text-xl text-center'>
              Putri dari Bapak & Ibu
            </p>
            <p className='font-fredoka text-xl text-center max-w-40'>
              {parentBrideName || "Bapak & Ibu"}
            </p>
          </div>

          <div className='flex flex-col items-center gap-2 max-w'>
            <p className='font-the-nautigal text-8xl text-yellow-500'>
              {groomName || "Groom"}
            </p>
            <p className='font-fredoka text-xl text-center'>
              Putra dari Bapak & Ibu
            </p>
            <p className='font-fredoka text-xl text-center max-w-40'>
              {parentGroomName || "Bapak & Ibu"}
            </p>
          </div>
        </div>

        <button
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'
          onClick={() => scrollToView("view3")}>
          <ChevronsDown
            size={32}
            className='text-white'
          />
        </button>
      </div>
    </section>
  );
}
