import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";

export default function QuotesSection({
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
          src='/assets/templates/free/wedding/minimal/bg-quotes.webp'
          width={900}
          height={1600}
          className='h-screen w-full object-cover'
          alt='Wedding Minimal Template'
        />

        <div className='absolute inset-0 bg-linear-to-tr from-black/50 to-transparent' />

        <div className='absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center'>
          <p className='w-full font-parisienne text-2xl font-bold text-white/70 text-center'>
            Agak lain memang kawan dunia ini, disini salah yang sana salah
            bodolah
          </p>
        </div>

        <button
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'
          onClick={() => scrollToView("view3")}>
          <ChevronDown
            size={32}
            className='text-white'
          />
        </button>
      </div>
    </section>
  );
}
