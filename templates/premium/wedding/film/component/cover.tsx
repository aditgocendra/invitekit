import { Button } from "@/components/ui/button";
import { CrossfadeCarouselCover } from "./carousel";

const DEFAULT_IMAGES = [
  {
    img: "/assets/templates/premium/wedding/film/cover.webp",
    alt: "Premium Wedding Film Template",
  },
  {
    img: "/assets/templates/premium/wedding/film/test2.webp",
    alt: "Premium Wedding Film Template",
  },
  {
    img: "/assets/templates/premium/wedding/film/test3.webp",
    alt: "Premium Wedding Film Template",
  },
];

export default function Cover({
  groomName,
  brideName,
  onOpen,
}: {
  groomName?: string;
  brideName?: string;
  guestName?: string;
  onOpen: () => void;
}) {
  return (
    <div className='relative min-h-screen w-full overflow-hidden '>
      <CrossfadeCarouselCover
        duration={10000}
        items={DEFAULT_IMAGES}
      />
      <div className='absolute inset-0 bg-black opacity-100 animate-[fadeOut_1s_ease-out_0.5s_forwards] z-30' />
      {/* overlay full di atas gambar */}
      <div className='absolute inset-0 my-28 sm:m-28 flex z-40'>
        <div className='flex flex-col justify-between items-center sm:items-start w-full h-full'>
          <p className='font-oswald text-4xl text-center truncate tracking-widest text-white opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards] transform-[translateY(20px)]'>
            <span className='text-gray-400'>THE</span> WEDDING OF
          </p>

          <div className='flex flex-col items-center sm:items-start sm:gap-3'>
            <p className='font-alexandria text-[12px] sm:text-[26px] tracking-wide text-white opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards] transform-[translateY(-20px)]'>
              <span className='text-gray-400'>COMING UP IN</span> DECEMBER 26
            </p>

            <div className='font-oswald flex flex-col sm:flex-row gap-1 sm:gap-4 justify-center items-center text-[40px] sm:text-8xl tracking-widest sm:tracking-wide font-semibold text-white'>
              <p className='text-center opacity-0 animate-[fadeSlide_1s_ease-out_1.5s_forwards] [--sy:0] origin-top'>
                {groomName || "Groom"}
              </p>
              <p className='opacity-0 animate-[fadeIn_0.5s_ease-out_2.5s_forwards]'>
                &
              </p>
              <p className='text-center opacity-0 animate-[fadeSlide_1s_ease-out_1.5s_forwards] [--ty:50px] origin-bottom'>
                {brideName || "Bride"}
              </p>
            </div>

            <Button
              type='button'
              className='z-50 relative bg-black font-alexandria text-lg sm:text-2xl sm:px-10 w-full sm:w-fit rounded-none py-8 my-2 sm:my-6 opacity-0 animate-[fadeSlide_1.5s_ease-out_0.2s_forwards] [--sx:0] origin-left'
              onClick={onOpen}>
              <span className='opacity-0 animate-[fadeIn_0.5s_ease-out_2.5s_forwards]'>
                OPEN INVITATION
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
