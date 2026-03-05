import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { ChevronsDown, LocateFixed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RefObject } from "react";

export default function SessionSection({
  ref,
  scrollToView,
  akad,
  reception,
}: {
  ref: RefObject<HTMLDivElement | null>;
  scrollToView: (view: "view1" | "view2" | "view3" | "view4" | "view5") => void;

  akad?: {
    time: Date;
    place: string;
    latlong: string;
    address: string;
  };
  reception?: {
    time: Date;
    place: string;
    latlong: string;
    address: string;
  };
}) {
  const defaultTime = new Date();
  // Akad
  const akadTime = akad ? akad.time : defaultTime;
  const akadLatLng = akad ? akad.latlong.split(",") : [];

  // Reception
  const receptionTime = reception ? reception.time : defaultTime;
  const receptionLatLng = reception ? reception.latlong.split(",") : [];

  return (
    <section
      ref={ref}
      className='w-full max-w-xl lg:max-w-2xl '>
      <div className='relative'>
        <Image
          src='/assets/templates/basic/wedding/minimal/bg-session.webp'
          width={900}
          height={1600}
          className='h-screen w-full object-cover'
          alt='Wedding Minimal Template'
        />

        <div className='w-full absolute bottom-1/2 translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-12'>
          <h1 className='font-the-nautigal w-full text-8xl font-bold text-center'>
            Save The Date
          </h1>

          <div className='space-y-12'>
            <h2 className='font-the-nautigal w-full text-6xl font-bold text-center'>
              Akad
            </h2>

            <div className='flex flex-col items-center gap-4'>
              <h3 className='text-2xl font-semibold'>
                {format(akadTime, "MMMM")}
              </h3>

              <div className='w-full flex gap-8 justify-center items-center'>
                <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                  {format(akadTime, "EEEE")}
                </p>
                <p className='text-6xl font-bold'>{akadTime.getDate()}</p>
                <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                  AT {format(akadTime, "hh:mm aa")}
                </p>
              </div>
              <p className='text-2xl font-semibold'>{akadTime.getFullYear()}</p>

              <div className='text-center mt-8'>
                <p className='text-2xl font-bold'>{akad?.place}</p>

                <p className='text-lg'>{akad?.address}</p>
              </div>

              <Link
                href={`https://www.google.com/maps?q=${akadLatLng[0]},${akadLatLng[1]}`}
                target='_blank'
                className={buttonVariants({
                  variant: "default",
                  className: "font-semibold",
                  size: "lg",
                })}>
                <LocateFixed className='mx-1' />
                Check Location
              </Link>
            </div>
          </div>

          <div className='space-y-12'>
            <h2 className='font-the-nautigal w-full text-6xl font-bold text-center'>
              Wedding Reception
            </h2>

            <div className='flex flex-col items-center gap-4'>
              <h3 className='text-2xl font-semibold'>
                {format(receptionTime, "MMMM")}
              </h3>

              <div className='w-full flex gap-8 justify-center items-center'>
                <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                  {format(receptionTime, "EEEE")}
                </p>
                <p className='text-6xl font-bold'>{receptionTime.getDate()}</p>
                <p className='min-w-40 text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-black'>
                  AT {format(receptionTime, "hh:mm aa")}
                </p>
              </div>
              <p className='text-2xl font-semibold'>
                {receptionTime.getFullYear()}
              </p>

              <div className='text-center mt-8'>
                <p className='text-2xl font-bold'>{reception?.place}</p>

                <p className='text-lg'>{reception?.address}</p>
              </div>

              <Link
                href={`https://www.google.com/maps?q=${receptionLatLng[0]},${receptionLatLng[1]}`}
                target='_blank'
                className={buttonVariants({
                  variant: "default",
                  className: "font-semibold",
                  size: "lg",
                })}>
                <LocateFixed className='mx-1' />
                Check Location
              </Link>
            </div>
          </div>
        </div>

        <button
          className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'
          onClick={() => scrollToView("view4")}>
          <ChevronsDown size={32} />
        </button>
      </div>
    </section>
  );
}
