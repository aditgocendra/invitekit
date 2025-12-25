import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RefObject } from "react";

export default function HeroSection({
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
      <div className='relative bg-linear-gradient'>
        <Image
          src='/assets/templates/free/wedding/minimal/bg-hero.webp'
          width={900}
          height={1600}
          className='h-screen w-full object-cover'
          alt='Wedding Minimal Template'
        />

        <div className='absolute inset-0 bg-linear-to-t from-black/40 to-transparent' />

        <div className='absolute bottom-1/12 left-1/2 -translate-x-1/2 flex flex-col items-center'>
          <h1 className='text-xl font-semibold text-white text-center text-nowrap mb-2'>
            THE WEDDING OF
          </h1>

          <h3 className='font-parisienne text-6xl font-bold text-white text-center text-nowrap mb-8'>
            Peter & Siti
          </h3>

          <Button
            className='bg-primary rounded-full text-3xl px-8 py-8 font-fredoka font-semibold'
            onClick={() => scrollToView("view2")}>
            Open Invitation
          </Button>
        </div>
      </div>
    </section>
  );
}
