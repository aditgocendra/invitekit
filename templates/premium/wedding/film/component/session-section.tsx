import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, ChevronsDown, LocateFixed } from "lucide-react";
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
      className='w-full min-h-screen'>
      <div className='w-full h-screen relative'>
        <div className='absolute inset-0 grayscale-25'>
          <Image
            src='/assets/templates/premium/wedding/film/cover.webp'
            width={1920}
            height={1080}
            className='h-screen w-full object-cover '
            alt='Wedding Minimal Template'
          />
        </div>

        <div className='absolute inset-0 font-alexandria text-white p-12 flex flex-col justify-center items-center gap-12'>
          <div className='space-y-12'>
            <h1 className='font-alexandria w-full text-4xl sm:text-6xl font-bold text-center'>
              Akad
            </h1>

            <div className='flex flex-col items-center gap-4'>
              <h3 className='text-2xl font-semibold'>
                {format(akadTime, "MMMM")}
              </h3>

              <div className='w-full flex gap-8 justify-center items-center'>
                <p className='min-w-28 sm:min-w-40 text-lg sm:text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-white'>
                  {format(akadTime, "EEEE")}
                </p>
                <p className='text-3xl sm:text-6xl font-bold'>
                  {akadTime.getDate()}
                </p>
                <p className='min-w-28 sm:min-w-40 text-lg sm:text-2xl text-center font-semibold border-b-2 border-t-2 py-1.5 border-white'>
                  AT {format(akadTime, "hh:mm aa")}
                </p>
              </div>

              <p className='text-2xl font-semibold'>{akadTime.getFullYear()}</p>

              <div className='text-center mt-8'>
                <p className='text-lg sm:text-2xl font-bold'>
                  Batiqa Hotel Ballroom
                </p>
              </div>
            </div>
          </div>

          <div className='flex gap-2.5'>
            {/* Days */}
            <div className='flex flex-col items-center gap-2'>
              <div className='bg-white/30 backdrop-blur-sm rounded-bl-2xl rounded-tl-2xl w-20 h-20 sm:w-32 sm:h-32 flex justify-center items-center'>
                <span className='text-3xl sm:text-6xl'>20</span>
              </div>
              <span className='text-white/70 text-sm sm:text-lg'>Days</span>
            </div>
            {/* Hours */}
            <div className='flex flex-col items-center gap-2 '>
              <div className='bg-white/30 backdrop-blur-sm w-20 h-20 sm:w-32 sm:h-32 flex justify-center items-center'>
                <span className='text-3xl sm:text-6xl'>20</span>
              </div>
              <span className='text-white/70 text-sm sm:text-lg'>Hours</span>
            </div>
            {/* Minutes */}
            <div className='flex flex-col items-center gap-2'>
              <div className='bg-white/30 backdrop-blur-sm w-20 h-20 sm:w-32 sm:h-32 flex justify-center items-center'>
                <span className='text-3xl sm:text-6xl'>21</span>
              </div>
              <span className='text-white/70 text-sm sm:text-lg'>Minutes</span>
            </div>
            {/* Seconds */}
            <div className='flex flex-col items-center gap-2'>
              <div className='bg-white/30 backdrop-blur-sm rounded-br-2xl rounded-tr-2xl w-20 h-20 sm:w-32 sm:h-32 flex justify-center items-center'>
                <span className='text-3xl sm:text-6xl'>20</span>
              </div>
              <span className='text-white/70 text-sm sm:text-lg'>Seconds</span>
            </div>
          </div>

          <div className='flex gap-4'>
            {/* <Button
              size='xl'
              className='font-alexandria text-xl w-[184px] h-[43px] rounded-none'>
              <span className='text-sm font-semibold'>RSVP Now</span>
            </Button> */}

            <Link
              href={`https://www.google.com/maps?q=${akadLatLng[0]},${akadLatLng[1]}`}
              target='_blank'
              className={buttonVariants({
                variant: "secondary",
                className: "font-semibold",
                size: "lg",
              })}>
              <LocateFixed className='mx-1' />
              Check Location
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
